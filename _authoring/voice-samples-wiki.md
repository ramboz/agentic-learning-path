# Voice Samples — Wiki

Five internal Adobe wiki pages authored by Julien Ramboz, ordered from
richest prose signal to most structured. Use for calibrating doc-register
voice: structural habits, vocabulary, how technical claims are grounded.

---

## 1. Improving performance of the Launch WebSDK integration

### Context

In the context of AEM EDS where we promise customers a green Lighthouse
Score (LHS), i.e. at least in the 90+ if not 100 stable, it has become
apparent that a rich marketing technology (martech) stack on the website is
having a negative impact on that target, and with decreased performance we
also have an impact on both the user experience (bounce rate increases) and
search index ranking (Core Web Vitals are taking into account in the
ranking).

While it is technically feasible to manually instrument most of those
3rd-party dependencies 1 by 1 in a performant manner, this typically
involves several roundtrips with developers and increases maintenance and
update efforts for that stack.

The industry standard for marketers is thus to leverage Tag Management
systems to inject those dependencies on websites so that they can
instrument A/B Testing, Personalization, User Interaction tracking, etc.

The top contenders we've faced so far are:

- Adobe Launch
- Google Tag Manager
- Tealium

In the context of this wiki, we will be focus on our own Adobe Launch to
see how we can improve the overall performance in the context EDS use cases.

### Tag container structure

In most cases we've seen from working with our customers, the contents of
the tag containers came down to:

1. **Content personalization:** A/B Test and personalization use cases,
   instrumented either with at.js (Adobe Target) or the AEP WebSDK, aka
   alloy, (Adobe Target, Adobe Journey Optimizer & RTCDP)
2. **Analytics:** Page and user interaction metrics gathering, instrumented
   with the AEP WebSDK (Adobe Analytics & Customer Journey Optimizer)
3. **Datalayer:** A datalayer, typically Adobe Client Data Layer
4. **Custom business events:** A set of customer rules and data mapping
   logic to trigger and track key user interactions on the page leading to
   business KPIs
5. **3rd-party:** Various 3rd-party libraries, like ad network
   instrumentations, user session recordings, etc.

### Current state

Here are some examples of existing customer EDS sites we have and the
performance impact of added Launch container.

We are comparing here a traditional instrumentation in the document head vs.
a delayed instrumentation which essentially skips the LHS. The goal is to
compare the current score with an "ideal" performant solution that would
still maintain all capabilities.

| Customer | Traditional instrumentation | Delayed instrumentation |
|---|---|---|
| Maidenform | | |
| Bitdefender | | |
| ICICI Direct | | |

In our experience, we estimate that most EDS website will take a 20~40pts
hit on the performance when they instrument the martech stack in the
traditional way.

### Preliminary work

During the last year where we worked closely with selected customers, we
were able to identify several key performance improvement opportunities for
some of the underlying libraries:

- **at.js**: https://git.corp.adobe.com/TnT/atjs-library-v2/issues/186
- **websdk**: Adobe JIRA PLAT-188699

We also built and tested an optimized martech loading library on various
EDS projects: https://github.com/adobe-rnd/aem-martech

### Learnings from co-innovation with customers

| Observation | Details | Learning |
|---|---|---|
| Deferring the martech improves performance | We've seen that deferring the martech to ~3s after the page is fully rendered essentially doesn't get measured in LHS anymore, so it doesn't impact the lab test results. The CWV from the field are also mostly green with that approach, since we land the main content early enough. | Loading the whole martech immediately will have a big performance impact, but loading it delayed will give us good user experience |
| Deferring the martech sacrifices A/B test and personalization use cases | Since we typically wait for 3~5s before Target/AJO kick in, we essentially cannot modify the content above the fold without major content flicker and impact on the UX | Target/AJO use cases, in most cases, cannot be delayed |
| Most of the performance impact is due to 3rd party libraries | We've seen that a fully optimized Launch container with WebSDK + ACDL + some custom rules can have <10pts impact. | We should handle 3rd-party, and core libraries differently. We don't control the former, so they'll always impact the performance to some degree. |
| We have several conflicting extensions available in Adobe Launch | We have legacy at.js v1, and v2, along with the WebSDK. And we also have the same for analytics. We've seen repeatedly that customers actually enable several duplicates inflating the container size (and perf impact) for no reason. | We should focus on a WebSDK only instrumentation to be future-proof and should put clear warnings if it is enabled along with other legacy libraries. |
| XDM schemas are complex to manage and customers do not use newer data mapping features | Most customers we worked with have existing XDM schemas with complex rules and data elements to prepare the data before it is sent to the backend. Target and Analytics both support a new data mapping capability that can simplify the logic (rules + data elements) and thus reduce the performance toll. | We should switch to data mapping where possible to simplify the Launch containers |
| Launch containers do not follow the progressive loading of EDS pages | In EDS, pages render by going through several phases: (1) the eager phase for anything in the critical path of the LCP, (2) the lazy phase for the rest of the initial page markup, (3) optionally some async content loaded when scrolling, (4) optionally some async content loaded on user interaction, (5) the delayed phase with all the non visual and non-interactive logic. | Prioritizing the logic in the Launch container, how its contents are granularly loaded and executed, could better tie into the performant EDS page rendering. Hooking into the EDS section/block rendering logic could also help mostly nullifying any content flicker. |
| Externally hosted Launch containers cause additional delay | The typical Launch container is loaded from the Adobe servers, and with EDS sites all running on HTTPS, this ends up requiring a new DNS resolution, plus establishing a TLS handshake before we can start executing anything in the tags. This typically takes ~600ms on mobile, which is directly added to the LCP time. | Self-hosting the launch container in the EDS code repository would offer an ideal performance boost. Alternatively, the following fallback scenarios can help a bit as well (in decreasing order): proxying the requests at the CDN, setting 103 early hints HTTP headers, setting `<link>` meta tags |
| Running most of the container logic in a webworker would save a lot of the performance budget | We've seen when trying out partytown that running the martech stack, even partially, in a proper web worker can help a lot with performance since we end up with a multi-threaded environment and are not blocking the main rendering thread anymore. Any non-DOM based dependency can typically be offset to a web worker quite easily, and we can then create a minimal SDK on the main thread to proxy DOM & UI related logic. | Re-architecting Adobe Launch to be web worker based would offer a long-term future proof basis for a performant tag system |

Summary observations:

- single container leads to increased LCP, TBT and content flicker
- self-hosting or proxying solves additional DNS + TLS handshake and LCP
  impact
- progressive loading of dependencies in eager/lazy/delayed reduces TBT
- mutation observers and controlled proposition application addresses
  content flicker

### KPIs

Based on our observations in the context of EDS, here are some ideal
targets we should strive for if we want to have good performances and
support all customer user cases.

| Phase | What | KB | Delay | TBT |
|---|---|---|---|---|
| Top of page (LCP) | Basic configuration for IMS Org, Datastream Ids, etc.; WebSDK loaded; propositions from Target/AJO retrieved | <50KB | <500ms | <10ms |
| Bottom of page | ACDL loaded; propositions from Target/AJO applied on all selectors in the markup; analytics page view event triggered; custom rules and data elements from Launch loaded | <150KB | <1s | <50ms |
| Delayed | 3rd-party dependencies | <1'000KB | <1.5s | n/a |

### Customer list

| Customer | Instrumentation | Experimentation/Personalization | Analytics solution |
|---|---|---|---|
| BitDefender (Life sciences, Aldevron, etc.) | Direct Target Delivery API with custom JS SDK | Adobe Target personalization via JSON Offers | Google Analytics |
| Danaher | Optimized at.js | Adobe Target personalization | Google Analytics |
| Oly (MMSG) | AEM Martech library + Launch Tag | Adobe Target | Adobe Analytics |
| Bulk | AEM Martech library + Launch Tag | Adobe Target | Google Analytics |
| Maruti | AEM Martech library + Launch Tag | Adobe Target + AJO | CJA |
| Petplace (also 24PetWatch) | AEM Martech library + Launch Tag | Adobe Target | Google Analytics + Adobe Analytics |

### Wishlist

In complexity order (low-hanging to complete rewrite).

| # | Topic | Requirements | Impact on CWV |
|---|---|---|---|
| 1 | integration | Have flags for both WebSDK and ACDL Launch extensions to use a self-hosted version of the library, and not inject it in the container, so we can keep using rules and data elements but load the 2 libraries ahead of the container | n/a |
| 2 | integration | Support automatically pushing a new launch container build to GH repos (instead of just sFTP) | TTFB / LCP |
| 3 | guardrail | Add clear warnings in Launch UI if you enable the WebSDK extension along with any legacy Analytics/Target extension | LCP / TBT |
| 4 | guardrail | Run a PageSpeed audit as part of the Launch container build so marketers get early feedback on the performance impact of their changes | all |
| 5 | progressive rendering | Use DOM mutation observers to automatically apply personalization propositions as selectors are added to the DOM, so we don't have to do that manually | TBT / CLS |
| 6 | progressive loading | Add support for several "phases" or "sub builds" for the container, so we can load it progressively based on the phases in the KPIs above (or more granular if needed by the project) | LCP / TBT |
| 7 | architecture | Re-architecting Adobe Launch so it centralizes most of the logic in 1 or several web workers to offset the main browser rendering thread | LCP / TBT |

---

## 2. Tiered validation for Code Fixes

### Problem statement

Our current coding agent needs to validate the fixes it comes up with
against the production environments before we hand over anything to the
customers so that we can guarantee the quality and positive impact of our
fixes.

### The challenges

#### Estimating the number of validation runs we need

Let's first look at the scale of validation we are talking about:

- Estimated customers by EOY '26: **200**

| | CWV | A11y | Security |
|---|---|---|---|
| Estimated URLs to crawl each week | Top 100 | Top 100 | 1 (site-wide settings) |
| Estimated groups to crawl each week | 10 | 10 | 1 |
| Average suggestions per page/site | 3 | 3 | 25 (log) |
| Average agent validation iterations per suggestion until a successful fix is found | 3 | 3 | 7 |
| Average metrics simulation run for each validated fix (playwright) | 5 | 5 | 5 |
| Total validation runs per week | 60,000 | 60,000 | 7,000 |
| Total validation runs per day | 8,500 | 8,500 | 1,000 |
| Total validation runs per hour | 350 | 350 | 40 |
| Total validation runs per minute | ~6 | ~6 | 1 |

#### Steps required for each validation

| | CWV | A11y | Security |
|---|---|---|---|
| **New code validation** | | | |
| Static Code Analysis | ✓ | ✓ | ✓ |
| Needs rebuilding JS | ✓ | ✓ | |
| Needs rebuilding CSS | ✓ | ✓ | |
| Needs rebuilding HTML fragments | ✓ | ✓ | |
| Needs full integration validation | | | |
| Metric validation | CWV | axe score | TBD |
| **Regression prevention** | | | |
| Visual regression via screenshots | ✓ | ✓ | |
| Semantic content validation | ✓ | ✓ | |
| Runtime JS errors validation | ✓ | ✓ | ✓ |
| Network calls stability (i.e. we did not break martech for instance) | ✓ | ✓ | ✓ |
| UX flows validation (major UX interactions on the page still work) | ✓ | ✓ | |

#### Validate against production

Since the point of our fixes is to improve metrics that we gather from the
production environments, we also want to re-validate each fix against that
same production environment.

We usually do not have permission to deploy code or change code on those
instead though.

#### Discrepancies between production and source code

In AEM CS and AMS, the production code (HTML, CSS, JS) is usually
dynamically built and not a 1 to 1 match to the original source code. So we
need to guarantee that any fix at the source actually does end up with a
positive impact on the production environment after the whole build process.

**HTML**

- requires running HTL or JSP
- depends on Sling Model, Sling Services or other Java POJOs

**JS**

- built locally in recent project archetypes, typically by webpack, but not
  only. Sometimes even with TypeScript transpiling
- clientlibs are then bundled by the maven-frontend-plugin into the content
  packages
- finally the AEM HTML Library Manager compiles and minifies the clientlib
  on the AEM instance directly

**CSS**

- built locally in recent project archetypes, typically by webpack, but not
  only. Sometimes even with SASS/LESS transpiling
- clientlibs are then bundled and minified by the maven frontend plugin
- finally the AEM HTML Library Manager compiles and minifies the clientlib
  on the AEM instance directly

#### Customer project code is not trusted

Building and running the customer project code for the validation also
requires proper sandboxing to avoid tenant cross-contamination and/or
system-level access.

Cloud Manager, RO/RV, already have that in place, but any solution we come
up with for the internal agent iterations also will need proper sandboxing.

### Suggested solutions

#### Reverse-proxying production

The coding agent uses an internal playwright session to load the production
URLs, and includes resource interception mechanisms to directly patch the
production code in the "browser session".

This allows basically monkey-patching production environments without the
constraints of having to manage an isolated restricted environment.

#### Tiered validation

| Tier | Validation | Where | Description |
|---|---|---|---|
| 0 | Static code analysis | In the agent | We make sure the fix is syntactically correct, and that the code will properly run |
| 1 | JS/CSS validation on live page | In the agent | We rebuild the minified clientlibs from the original source code |
| 2 | HTML/servlet validation on live page | On CM deployment | We rebuild the final markup from the HTL/JSP templates, including Sling models, Java POJOs, etc. |
| 3 | Regression testing | Split between agent and CM deployment | We run a full suite of general regression tests to limit the risk of introducing new bugs in production |
| 4 | Expert project-level validation | In PR review | A project expert does a final human review to make sure the fixes take undocumented project specificities into account and follows the project best practices and conventions |

#### Sandboxing

- Docker Image or some other form of containerization
- node/npm, with lowest LTS version for increased compatibility with older
  customer projects
- java/mvn, with targeted maven builds (skip all tests, just execute the
  clientlibs build steps)
- aggressive caching for npm modules, and .m2 repository to reduce amount
  of dependencies to pull in each time
- aggressive static code analysis to limit how many fixes go to tier 1
  (since this will be our bottleneck)

#### Technical options

- CM pipeline
- RV pipeline
- RDE
- Custom pipeline

### Open questions

| Question | Answer |
|---|---|
| Why not just do everything in Cloud Manager / RV / RO? | Seeing the number of runs we expect, the COGS would be too expensive. Also, we do not need full deployments, but just some partial build steps for the agent validation |
| Can we just run a node build? | No, there is no node module that fully builds the production ready client libraries. Trying to replicate the maven frontend plugin in node is too much of an effort, and prone to many edge cases |
| Do all tracks need all the steps? | No, Security fixes for instance are usually site-wide, and not page specific. They also are mostly "configuration" or "permission" related, and thus don't need the same complete build mechanism |

---

## 3. AEM Experimentation integration with Target VEC and AJO Campaigns

| | |
|---|---|
| Status | POC |
| Epic | TBD |
| Lead | — |
| Team | TBD |

### Use case

As a marketer, I want to create A/B Test experiments using my existing
Target license via the Visual Experience Composer (VEC), and run those with
minimal performance impact on an AEM Edge Delivery Services website.

### Assumptions

- Using at.js is known to have a serious performance impact, so that
  option is eliminated
- Using the target delivery APIs can give us the final decision, but the
  Target CDN will be slower than the AEM EDS one, and will anyway require
  resolving an additional host and establishing an SSL handshake, possibly
  as part of the LCP
- Target admin APIs are protected behind authentication and are also not
  performant, so they can't be used directly

### Architecture

We propose the following architecture to support the use case.

In a nutshell:

1. When an AEM EDS page is previewed or published, we trigger a GitHub
   Workflow that will go and fetch the experiment config from the backend
   (Target)
2. The GitHub Workflow calls an action that will authenticate against IMS
   (using a technical account set up by the project team via the AIO
   Developer Console), and then call the backend API (Target) to retrieve
   the experiment config. The config is then converted to the AEM EDS
   format (manifest) and cached in the GitHub repo.
3. The AEM EDS GitHub bot will push cached manifest to the code bus, and
   it thus becomes available via the regular hostname
4. When the page is loaded and contains a reference to the experiment, we
   retrieve the experiment manifest and run it through the regular AEM
   Experimentation plugin
5. The AEM experimentation is enhanced with a simple SDK that knows how to
   apply page modifications like those created via the Target VEC and
   applies them on the page load

#### Details of the GitHub Workflow

In a nutshell:

1. The workflow fetches the current page from AEM EDS and extracts the
   experiment metadata
2. If we have an experiment configured, when then authenticate against IMS
   with a technical account configured by the project team
3. We get the experiment config from the admin/authoring APIs in the
   backend service (Target), using a specific API key that is allow-listed
   for this
4. We convert the resulting config into the standard AEM EDS experiment
   manifest format
5. We cache this in the GitHub repo so it gets pushed by the GitHub bot to
   the code bus and becomes available on the website hostname

### Tasks

| Task | Status | Comment |
|---|---|---|
| **GH Action** — Send GitHub events when a page is previewed/unpreviewed so we can trigger the workflow | DONE | Linked PRs in helix-admin and helix-bot |
| **Write a GitHub action that can be used in workflows and that caches** | | |
| — Authenticate against IMS | DONE | |
| — Get API Key provisioned to query the backend | DONE | |
| — Fetch the experiment config from the backend | DONE | |
| — Convert the experiment config to a standard manifest model | TODO | We have some basic code but this needs to be moved to the GH action and standardized |
| — Cache the manifest in the GitHub repo | DONE | |
| — Extract common methods from the GH action into a util that can be used across the repo | TODO | We had several explorations to sync configs from AEP, Target, and have AJO in the works. The overall action always looks the same and there is a lot of copy-pasting, so extracting common methods into a re-usable util would help a lot |
| **AEM Experimentation Plugin — Add page modifications support** | | We have some basic code but this should be extracted to a minimal SDK that is lazy-loaded only if the manifest has page modifications, so that the regular experiments run faster |
| — Support HTML modifications | DONE | |
| — Support CSS class additions | DONE | |
| — Support attributes addition | DONE | |
| — Support property addition (i.e. background) | DONE | |
| — Support image replacement | TODO | |
| — Extract a clean minimal "SDK" | TODO | |
| Support both Target Experiment Id and full URL in the metadata of the source document for more flexibility | TODO | |
| Experimentation plugin should not run when the page is embedded in an iframe, otherwise the visual composers are not guaranteed to see the control when the page is modified | TODO | |
| Run page modifications also on the decorated blocks before they are shown for non-semantic selectors | TODO | |
| **Target audience support** | TODO | |
| **Support for RTCDP segments in Target** | TODO | |

### Open questions

| Question | Answer |
|---|---|
| How can we handle selectors for "decorated HTML" in the Target config when the experimentation plugin runs against the initial "semantic HTML"? | We could apply the page modifications at the end of the block decoration before showing the block for selectors that didn't match the semantic HTML. Chances are this would have minimal performance impact since we are already manually decorating HTML in that phase, so a few more DOM calls should be mostly transparent |
| What are the main "modifications" we want to support from the VEC editor? | |
| What kind of audiences do we want to support? | |

### Related work

- Moving the experimentation pill into the sidekick as a palette

### POC

- Demo project git repo:
  https://github.com/ramboz/aem-experience-decisioning-demo
- GitHub Action:
  https://github.com/adobe-rnd/aem-experimentation-gh-actions/tree/main/target-sync

### Next steps

Extend the use case to support:

- Target JSON offers
- AJO Web Channel Campaigns (using the visual editor and align with Target
  VEC flow)
- AEP Experiments (via API only since we don't have a UI yet)

---

## 4. Research — Modifying content directly in MS Sharepoint / Google Drive

### Use case

In the context of Experience Success Studio, we have several automation
ideas on the roadmap that will require some form of content modifications
directly in the content repository for the Edge Delivery site.

For instance:

- automatically creating new content variations of existing documents and
  fragments
- automatically creating new experiments from a UI wizard
- automatically fixing broken redirects
- automatically optimizing SEO tags for top pages

### Technical requirements

- These content changes need to be performed via some RESTful API
- Permissions should be handled separately from the Helix Bot to avoid any
  conflicts with the core team
- Permissions should be given only to a limited Sharepoint collection or
  Drive folder to limit the risks, and limited to the file operations we
  need (i.e. manipulating documents and spreadsheets)
- Instrumentation should be "simple" like the Helix Bot. We should be
  offering a public "bot" that customers can just give access to
- We should have a simple "library" that abstracts authentication and API
  calls in a standardized manner for all content repositories
- We should be able to perform file operations (create, copy, move, delete)
- We should be able to modify spreadsheets (add/remove rows, add/remove
  columns, find entries, etc.)
- We should be able to modify documents (find specific blocks/sections,
  modify them, add/remove content)

### Microsoft Sharepoint

- API: Microsoft Graph API
- Requires:
  - an App to be registered with the Microsoft identity platform for
    internal Adobe use
  - an Enterprise Application with multi-tenant access for external use by
    customers
  - explicit permissions being given to the enterprise app by the sharepoint
    admin to the site collection for the project if hosted on customer
    sharepoint tenant (instead of adobe one)
- Access:
  - "Delegated": app acting on behalf of a signed-in user => not
    applicable as 1) this requires the end user to actually log in, 2)
    elevates the permissions of the "bot" to the user and all resources
    they have access to and 3) requires more involvement with customer IT.
    The core Helix team is also moving away from Delegated permissions.
  - **"App-only":** app acting with its own identity
- Authentication:
  - Client ID and secret: less secure than a certificate
  - Client certificate
- Service principal permissions required:
  - `Files.SelectedOperations.Selected`: Access selected Files without a
    signed-in user.
  - `Sites.Selected`: Access selected site collections
- Libraries:
  - MSAL (auth)
  - MS Graph Client (API client)
- Limitations:
  - Requires Adobe admin approval for the permissions (pending)
  - MS Graph API does not let you directly modify Word documents. It only
    exposes an array buffer in the API. There are also no easy node
    libraries to parse an existing Word document to update it, so best
    approach is Word-to-MDast and back… but we lose any formatting along
    the way

### Google Drive

- APIs:
  - Drive
  - Sheets
  - Docs
- Requires:
  - a project set up in Google cloud console
  - access to Google Drive API, Google Docs API & Google Sheets API to be
    given to the project
  - project folder to be shared with the service account with "edit"
    permissions
- Access:
  - "API Key": Identifies your project using a simple API key to check
    quota and access => not applicable as this essentially gives global
    access to the Google Drive for that project, and 2) customer IT would
    need to set this up and share the secrets with Adobe
  - "Oauth client ID": Requests user consent so your app can access the
    user's data => not applicable as 1) this requires the end user to
    actually log in, 2) elevates the permissions of the "bot" to the user
    and all resources they have access to and 3) requires more involvement
    with customer IT
  - **"Service Account":** Enables server-to-server, app-level
    authentication using robot accounts
- Authentication:
  - Service account key => less secured
  - Workload Identity federation
- Service account oauth scopes required:
  - `https://www.googleapis.com/auth/drive`
  - `https://www.googleapis.com/auth/documents`
  - `https://www.googleapis.com/auth/spreadsheets`
- Limitations:
  - Requires Adobe admin to create the service account
  - Google Cloud Service Accounts have complicated names. Something like
    `<service-account-name>@<google-cloud-console-project-name>-<google-cloud-console-project-id>.iam.gserviceaccount.com`
  - Cumbersome REST API to modify documents

### POCs

#### Accenture/Petplace publish later sidekick extension

Code:
https://github.com/hlxsites/petplace/blob/sk-sp-integration/tools/sidekick/sharepoint/index.js

Covers:

- generic interface for content modifications
- Sharepoint client and auth
- Delegated access with user Oauth

#### Garage Week 07/24

Code: https://github.com/ramboz/helix-content-sdk

Covers:

- generic interface for content modifications
- GDrive client
- (private) Service Account using key authentication

#### Next steps

1. Get Adobe admins to approve Azure app permissions so we can port the
   "petplace" code to the content SDK
2. Get Adobe admins to give Azure app permission to modify Franklin
   projects
3. Implement document modifications that are currently missing
4. Test the GDrive approach with a Generic Account to have something easier
   to manage by the customer admins

---

## 5. Requirements for a cookie consent solution

### Constraints

#### Technical

- Loaded eagerly with no/minimal performance impact
- Does not need to block LCP
- Should integrate with:
  - Adobe Consent 2.0 in AEP
  - OneTrust
  - TrustArc

#### UX

- Minimally invasive on mobile. It should not be detected as LCP
  - Preferably a simple "bar" that opens an overlay/popup
- Preferably non-blocking for the experience
- easy to localize

#### Legal

- Explicit consent: opted-out by default, opt-in on request to be compliant
  (no pre-ticked boxes) (GDPR)
- Consent must be "informed" (GDPR / CPRA)
- Allow withdrawal of consent on user request in an "easy-to-access" way
  (i.e. not hidden deep in a link in the policy page) (GDPR)
- No cookie usage (except necessary performance cookies) unless explicit
  consent is given (GDPR)
- If "accept all" is present, "reject all" should also be (GDPR)
- Accepting all cookies should be as easy as rejecting all cookies (and
  vice versa) (GDPR)
- Banner needs to be clearly distinguishable (GDPR)
- Cookie banner should link to full cookie policy (GDPR)
- Opt-out should be the default for all non-strictly-necessary cookies
  (GDPR)
- No cookie wall (CPRA)
- "do not sell my personal information" & "do not share my personal data"
  button requirements (CPRA)
- No "Dark patterns" (CPRA)
- Should support "Global Privacy Control" (CPRA)
- No customer profiling without explicit consent (CPRA)
- No collection, usage or sharing of sensitive personal info without
  explicit consent (CPRA)
- No sharing of personal information with 3rd-parties without explicit
  consent (CPRA)
- No targeted advertising using personal information without explicit
  consent (CPRA)
- No automated decision-making technologies having legal or significant
  effect on consumer without explicit consent (CPRA)
- No collection from minors under 16 without explicit consent (CPRA)
- No collection from minors under 13 without explicit parental consent
  (CPRA)

### Definitions

- **Personal data:** The data subjects are identifiable if they can be
  directly or indirectly identified, especially by reference to an
  identifier such as a name, an identification number, location data, an
  online identifier or one of several special characteristics, which
  expresses the physical, physiological, genetic, mental, commercial,
  cultural or social identity of these natural persons. In practice, these
  also include all data which are or can be assigned to a person in any
  kind of way.
- **Personal information** is information that identifies, relates to, or
  could reasonably be linked with you or your household. For example, it
  could include your name, social security number, email address, records
  of products purchased, internet browsing history, geolocation data,
  fingerprints, and inferences from other personal information that could
  create a profile about your preferences and characteristics.
- **Sensitive personal information** is a specific subset of personal
  information that includes certain government identifiers (such as social
  security numbers); an account log-in, financial account, debit card, or
  credit card number with any required security code, password, or
  credentials allowing access to an account; precise geolocation; contents
  of mail, email, and text messages; genetic data; biometric information
  processed to identify a consumer; information concerning a consumer's
  health, sex life, or sexual orientation; or information about racial or
  ethnic origin, religious or philosophical beliefs, or union membership.