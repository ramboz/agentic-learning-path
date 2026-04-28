# Voice Samples — Slack

Three internal Adobe Slack threads where Julien Ramboz was active. Cleaned
of Slack UI noise (timestamps, edit markers, reply counts, link unfurls,
image placeholders) while preserving conversational flow and code blocks.

Use for calibrating chat-register voice: concession-then-point openings,
"In a nutshell" teaching shape, second-person conditionals, direct
acknowledgment of mistakes, and how technical claims are grounded in
specific links and line numbers.

---

## Thread 1 — AEM Experimentation vs Target (QNX)

**Ive Andric:** Hi Dirk, we have been evaluating the available options for
implementing personalization within QNX. While they already possess an
Adobe Target license, I also wanted to review the capabilities of
Experimentation. From the documentation, it appears that Experimentation
delivers improved Lighthouse performance comparing to Target; however, I
am uncertain whether it provides the full range of functionality offered
by Adobe Target. Could you please advise on the recommended approach for
the Xwalk project?

**Dirk Rudolph:** Julien, can you help here?

**Julien:** Sure!

Ive, we do have an extremely lightweight (and fast) experimentation engine
that runs natively on AEM without Target.
https://github.com/adobe/aem-experimentation/ has some more technical
details.

In a nutshell:

Pros:

- it has close to no impact on the Lighthouse score
- it is privacy-compliant
- it has simple audience support
- it is simple to create content variants for A/B Testing and pushing the
  winner to production

Cons:

- it is really limited feature-wise compared to Target
- it is mostly target towards cookie-less use cases
- it doesn't offer fine-grained personalization or audiences like Target

The engine is typically used when you need to run A/B test on the 1st
page view, before consent is given, and on audiences that can be directly
inferred from the browser (like mobile vs desktop). Or for use cases that
are around fixing obscure code issues with no deterministic fix, and that
are not subject to marketing use cases that require user consent.

The engine is flexible enough that you can push it beyond those simple use
cases, and we've done things like basic personalization using RTCDP
audiences for instance, including user consent… but it's all project-level
implementation.

**Ive Andric:** Thanks a lot Julien for the info! I appreciate it. I will
check this all and ask more questions here if we decide to go with
experimentation.

**Julien:** Sounds good! You can ping me any time :)

**Sumanta Pakira:** Hello Julien, I would like to ask two questions. The
basic Adobe Target license offers only A/B testing but premium license
offers Recommendation and other advanced feature.

1. The github project link you mentioned, it offers only basic Adobe
   Target feature?
2. If we use RTCDP then all other advanced feature of Adobe Target are
   possible to implement using the same experimental project?

**Julien:**

1. No, it's not directly related to Adobe Target. It's an independent tool
   that basically covers a gap that Target does not address yet (i.e.
   cookie less, privacy first experiment on the 1st page view)
2. No. The tool is really limited. You'll need Target to benefit from the
   Target features, especially the more advanced ones, and anything
   related to AI

In a sense, the tool will let you take a page, create a few copies that
will act as variants in an A/B test, and you can trigger the A/B test
based on a given audience. That audience is defined at the project level,
in the code, and we typically limit it to Browser APIs (like checking for
mobile vs desktop). It is flexible enough that you can theoretically use
any 3rd-party REST API to evaluate an audience if that is what you want…
but it's a manual integration at the code level and comes with all the
usual constraints (legal review, page load performance, etc.)

Maybe before we discuss the tool, it would be best if you could explain
the use cases you have.

**Sumanta Pakira:** thanks, will get back to you, we are in the process of
defining use cases.

**Ive Andric:** Hi Julien, happy New Year! :) I've come back with the use
case so we can review it before proceeding and confirm whether everything
can be covered by the Experimentation tool. Below is a short summary of
our Adobe Target use case for the website. Please let us know whether you
would recommend using the Experimentation tool or continuing with Adobe
Target.

> Use Case: Adobe Target personalizes the website in real time to match
> each visitor's evaluation intent—strategic or technical—so buyers find
> the right information faster and move through long B2B decision cycles
> with less friction.
>
> How It Works: Adobe Target tracks key user behaviors (navigation clicks,
> content viewed, return visits) and builds a persistent intent profile
> across sessions. Based on this profile, the site dynamically adapts
> headlines, navigation, content order, and CTAs.
>
> Key Scenarios:
> - Strategic Buyers (Benefit Seekers): See safety certifications,
>   compliance assets, and industry-specific proof highlighted immediately.
> - Technical Evaluators (Engineers): Get fast access to SDKs, APIs, BSPs,
>   benchmarks, and "continue where you left off" developer content.
> - Campaign & Context-Driven Visitors: Landing experiences align
>   instantly with ads, emails, industry focus, or abandoned forms.

**Julien:** I'd stick with Target for this. What you describe here is
really personalization based on audiences and an evolving user profile.

The experimentation tool just focuses on A/B tests with random assignments
of the variants. It will not let you create complex audiences, and will
also not keep track of the user profile and user interactions for you. It
would also not guarantee a deterministic experience for a given user based
on his profile… it's a random assignment.

The experimentation tool is usually positioned for 2 main use cases:

- you need to run an A/B test on the 1st user visit, before any user
  consent is given (privacy-first use cases)
- you need to run an A/B test with minimal impact on the page load
  performance (as in <150ms impact on the page load)

**Ive Andric:** Thanks for your help, we will keep this in mind for the
future — Experimentation tool for some smaller bits

**Md Maroof Khan:** Hi Dirk, Julien — Before moving forward with an
implementation approach for QNX, we'd like to clarify Adobe's recommended
strategic direction for EDS + Target in enterprise personalization
scenarios.

The client expects an author-driven workflow similar to classic AEM Sites,
where content variants can be created by authors and then mapped to
audiences/experiences in Target.

Could you please advise:

1. What is the recommended approach for this with EDS today?
2. Is the current integration model the long-term direction?
3. Are there planned enhancements to better support this type of
   workflow?

This is impacting upcoming campaigns, so we want to align with Adobe's
roadmap before proceeding.

**Julien:** What timelines are we looking at?

We do have a new initiative around simplifying personalization workflows
in Universal Editor with tighter integration with Target, but not
something that will materialize immediately.

I'd probably also ready start structuring the content with content
fragments and variations and export those to Target. This is the typical
flow for now.

**Md Maroof Khan:** Thanks for the response Julien — QNX is looking for
something ASAP. They also opened a support ticket on this.

**Julien:** If it's ASAP, then the aem-martech plugin with a traditional
Target integration is probably their best bet. With Launch integration if
they need more advanced data preparation for Target audiences.

I would probably directly engage with some Target experts to review the
use cases and fine-tune this based on their exact needs.

**Md Maroof Khan:** ok sure, we will evaluate from our side.

**Dirk Rudolph:** > I'd probably also ready start structuring the content
with content fragments and variations and export those to Target. This is
the typical flow for now

Julien, why that?

**Julien:** To immediately align with the Offer Management initiative we
have ongoing, so mid-/long-term they can leverage the new UI for this in
Universal Editor.

**Dirk Rudolph:** Content Fragments don't play a role in Edge Delivery w/
UE. They are more or less disconnected.

**Julien:** Good point! I was still thinking about AEM CS content
structures, but this is EDS.

**Md Maroof Khan:** Yes, I think the page fragment would a be a viable
candidate for different variations, no?

**Julien:** By the way, are you typically doing VEC activities in Target
or Form-based ones?

**Md Maroof Khan:** Julien, I will check with client and get back to you
on this question. Could you please provide some insights on the offer
management initiative?

**Julien:** We are building a cleaner integration between Target and AEM
as a universal editor extension. It's still very early stage, so the
timelines may not align well, but we are always happy to discuss your use
cases to make sure the solution is compatible with them. Olena Tkacheva
would be the product manager to engage for this.

**Ive Andric:** Julien, can you please confirm that Form-based is at.js
and cannot be used with alloy.js? We implemented the Target with Web SDK
so is that now giving much more complexity?

**Julien:** Form-based works fine with alloy.js, you just need to specify
the decisionScopes in your alloy calls. Propositions are not automatically
rendered, and you have to render them on-demand.

Something along the lines of the following should work:

```javascript
alloy("sendEvent", {
  renderDecisions: false, // Don't auto-render — we'll do it manually
  decisionScopes: ["hero-banner"] // Your Target location names
}).then(({ propositions }) => {

  const executedPropositions = [];

  propositions.forEach(proposition => {
    proposition.items.forEach(item => {

      if (item.schema === "https://ns.adobe.com/personalization/html-content-item") {
        // 1. Render the offer
        const container = document.getElementById("hero-banner-container");
        if (container) {
          container.innerHTML = item.data.content;

          // 2. Track for impression reporting
          executedPropositions.push({
            id: proposition.id,
            scope: proposition.scope,
            scopeDetails: proposition.scopeDetails
          });
        }
      }

    });
  });

  // 3. Fire display notification AFTER rendering
  if (executedPropositions.length > 0) {
    alloy("sendEvent", {
      xdm: {
        eventType: "decisioning.propositionDisplay",
        _experience: {
          decisioning: {
            propositions: executedPropositions
          }
        }
      }
    });
  }

});
```

And if you are working with JSON offers instead of HTML ones, then the
"if" condition would be like:

```javascript
if (item.schema === "https://ns.adobe.com/personalization/json-content-item") {
  const offerData = item.data.content; // Already parsed as JS object
  console.log("JSON offer received:", offerData);
  // e.g. populate a React component, call a downstream API, etc.
}
```

**Ive Andric:** Thanks, will try to go with html one. Hey Julien, I saw
that Chris Millar posted this on Linkedin — is this the same option that
is coming and will be available in UE?

**Julien:** Chris has been exploring the direct EDS/DA route and
optimizing for it. We have a parallel track happening for AEM in the
broader sense that is similar in its approach, but more integrated down
the road. As I mentioned earlier, Olena Tkacheva would be the product
manager to engage for this and give you the vision :)

---

## Thread 2 — Experimentation reporting for DA / JMP

**Chris Millar:** Julien, Tad is looking for some guidance on getting the
last mile of AEM Experimentation up and running. I think he's particularly
interested in the RUM tracking pieces, but there may be more.

One point of self-inflicted confusion is that DA's Experimentation rail,
which was influenced by the original Figma mocks list out:

- Overall conversion
- Form submission
- Engagement

for goals. From what I can gather from your docs, there's not really a
differentiation for the above... it really comes down how you setup your
RUM and what you want to track. I think for both of us, it would be good
if you could say how these are mapped into page metadata if they are
something that is codified as fixed goals an author can select.

References:
- https://github.com/adobe/aem-experimentation
- https://github.com/adobe/aem-rum-conversion

**Tad Reeves:** Thanks so much for this, Chris — and your
characterization is accurate. The customer (JMP) would very much like to
leverage experimentation, and just need some guardrails and guidance as to
what they should expect that works, and what they have to do on their end
to set their project up to use it. As a note, they are a DA project fully
on Edge Delivery that went live in February.

**Chris Millar:** ...and maybe a point of clarification: all the toggling
is working as expected. It's the data tracking they're wanting more
details on.

**Julien:** So the question is just what these 3 categories influence?

I guess that if they are a DA customer and are using the DA rail then,
Chris, your team is handling the instrumentation and guidance right?

For the 3 categories, RUM actually tracks:

- conversion, but not via https://github.com/adobe/aem-rum-conversion,
  we've made this a native feature in OpTel now
- form submissions are part of the conversion now
- Engagement is measured as 2 different sub-metrics:
  - actual interaction with the page (think click-through rate)
  - scroll-depth (think time spent on page and how much was viewed)

Gilbert and Xinyi Feng are working on a central dashboard system that will
let you query that data and slice-and-dice it the way you want. I'd expect
something available in the September/October timeframe.

In the meantime, the easiest is still to push the experimentation
information to an Analytics solution and do the analysis there. The RUM
Explorer is pretty limited in what it can do, and it won't be reporting
granularly on those at the moment.

You also have the option to leverage
https://github.com/adobe/rum-distiller to directly query the RUM data, but
that's probably too involved compared to just piping the data to analytics
at the moment.

The 3 metrics are tracked either way, the flag is just basically to
prepare the reporting dashboard with the proper view to slice and dice in
the analysis. You'd still be able to switch to the other metrics if
desired… so that config does not influence the runtime or the data
collected.

**Chris Millar:** > your team is handling the instrumentation and guidance
right?

No. Our rail just sets the metadata based on your properties. It's only a
UI to set all the regular stuff you would set by hand in a Word doc.

**Julien:** ok, yeah, that's what I meant, sorry :) If there are any
issues DA side, you handle it, otherwise it's our team.

**Chris Millar:** Yes. Exactly. But... from our POV, it's just a table. We
just need to know if there's anything in the table we need to set for
those different goals (or even if it matters). I.E. was expecting to see
something here:
https://github.com/adobe/aem-experimentation/blob/main/documentation/experiments.md

**Julien:** For now it doesn't matter… you could hide the field. It's
only going to have an actual impact in a few months when we release the
reporting dashboards.

**Chris Millar:** Do you all support multi-armed bandit tests, yet?

**Julien:** Technically we can make it work if there is real interest…
but usually Target is better suited for that. Our engine is too
lightweight for most interesting cases. (it's also not documented since
there is no adoption at the moment)

**Chris Millar:** Awesome. Thanks for the clarification. I got my answers.
Will defer to Tad for what he needs on his end.

**Tad Reeves:** This is quite helpful so far Julien. Since JMP is not an
Adobe Analytics customer, and they don't necessarily have a massive
amount of GA360 knowledge to integrate bigquery data into their reporting
stream, I'm thinking they're hoping to have some manner of simplified
reporting to at least be quasi-related to the Figmas that were shown at
Summit. I'm mostly trying to figure out the best thing to tell them at
this point — and that seems like Sept/Oct timeframe for the reporting
dashboard is what I should tell them?

**Julien:** Do they have any analytics solution at all? not necessarily
AA. I'm not sure what was shown at Summit to be fair… so I don't know
what the expectations are there :sweat_smile:

**Chris Millar:** At Summit: The Figma mocks that showed data being
plugged directly into the experimentation rail.

**Julien:** What Figma mocks specifically? because I know there have been
multiple tracks in parallel and I'm not sure what the customer has seen
and if that still aligns with what we do. if not, I'd rather re-align now
than later :)

**Tad Reeves:** Hey Julien — I tried to find the mocks in the notes I had
from Adobe Summit, but don't think I saved them. It was either L322 or
L320 that took users through AEM Experimentation, and in such had mocks
for return data from experimentation visualized as pills in the
Experimentation sidekick. That's what the customer was exposed to, as
Aaron (who leads the team for JMP) was in that same session I was. If the
right answer for the customer is to wait for basic data return to be
available in a UI that the customer can easily access, then I can tell
the customer that it's not available yet and a semblance of what they saw
at Summit will be available in the Sept/Oct time frame as you noted
earlier. They want to take advantage of Experimentation, but as they
don't have AA or a ton of GA4 knowledge/bandwidth, telling them to build
their own dashboard and parse the raw data themselves won't really be a
starter for them.

**Julien:** If what you saw was that "big green pill button" on the
bottom right, then yeah… that's basically going away. We are replacing it
with a full-on "side rail" that will allow CRUD operations and data
visualization. That will be available for EDS & XWalk (September) and CS
(targeting November).

For DA, Chris and team had done already an implementation of this to some
degree… but we are not actively working on the DA side. It hasn't been a
priority for our PM so far.

**Tad Reeves:** Not a priority from the PM.... :disappointed:

**Julien:** Our PM has literally 0 DA customers… :shrug: So priority was
put on CS, where we have a larger pipeline that needs to be addressed
first and where we have a major gap.

**Tad Reeves:** Well, once DA is officially acknowledged as a product,
I'm sure that will accelerate. I do understand though. I'll tell the
customer that this will have to be on hold for a bit until either (a) it
gets priority due to customer adoption or demand, or (b) they're able to
integrate the outputs themselves.

**Julien:** Chris and team have been bridging the gap so far for DA. We
do have a general Dashboard (not in-page context, but a separate service)
that should be released in October/November, though… so that should cover
the reporting needs. It just won't be as well integrated as a proper side
rail in DA directly. (think of it, like opening a separate analytics
dashboard to see the results)

**Chris Millar:** I want to make sure I understand: we have no externally
available data today or we have no UI today?

**Julien:** No UI. The raw data is in RUM (OpTel) and crunched by Sites
Optimizer APIs on a regular basis via automated audits, and we pull it
from there in the new UI. The previous pill was directly accessing the
raw RUM data, but that API is going away. And no need for a Sites
Optimizer license (SKU), it's just that we technically use their stack to
do the crunching, but it's a separate use case.

**Chris Millar:** Ok, so the current state is:

1. There's data today, but it's going away and no one should use it (?).
2. DA Exp Rail already does full CRUD today, but does not surface
   reporting data.
3. XWalk and BYOC (Word, Docs) Exp Rail will do "data visualization" —
   September.
4. General editor agnostic Dashboard — October / November

**Julien:**

1. The data is the same, it's just the access to it that is changing. We
   still continue collecting the same RUM data as before. The previous
   APIs were just used for debugging, were costly and didn't scale well.
   So the (helix) team had to pull the plug on them, and we (Sites
   Optimizer and Contextual Experimentation teams) have worked with them
   on a new way to access them that is more efficient so end user UI is
   more responsive and resilient.
2. - 4. Correct.

And if you need immediate data reporting, you can just proxy the data
through some Analytics (GA4, AA) and analyze it there.

**Tad Reeves:** I mean...for JMP, if the data is accessible in a
structured form they'll probably have fun just analyzing it in the JMP
Software. :)

**Chris Millar:** Tad — We will try to find where the existing pill is
and see how it's pulling the data. We can at least get you parity with
the old green pill while we wait for the new endpoints.

**Julien:** You can leverage https://github.com/adobe/helix-rum-bundler
with a domain key to basically query the RUM data like the RUM Explorer
does it. That's your best bet at the moment if you want direct raw data
access. https://github.com/adobe/rum-distiller can also help with some
reference slicing & dicing.

**Tad Reeves:** Julien I wanted to check in on this thread, and see if
there has been any motion on Experimentation since we last spoke. The
customer (JMP) just asked about this, and I've not heard any mention of
Experimentation over the last few months. Chris not sure if you've heard
anything either. Plenty of other agents & funny business has been getting
the spotlight recently. :)

**Julien:** Hi Tad! The Contextual Experimentation side rail should now
be available for EDS (via sidekick plugin for doc-based authoring) and
AEM CS (via Universal Editor extension).

The current roadmap that the team follows is roughly:

- Global reporting dashboard in Q1
- AEM CS page authoring integration in Q2
- DA Rail integration after

Jim Stoklosa is leading this from the product management side, so best to
check in with him for ETA and prioritization if needed.

---

## Thread 3 — MarTech plugin + AEP ingestion (Bulk)

**Jonathan Clarey:** Hi dpopescu and Nina, we are currently seeing several
errors streamed into AEP when using the MarTech Plugin. We have since
updated to the latest version and added the following code before
initialisation. But we are still seeing these errors, can you help us
know what we may need to add to the schema or other resolution needed?

```javascript
shouldProcessEvent: (payload) => {
  return [
    'web.webpagedetails.pageViews',
    'commerce.productListAdds',
    'commerce.productListOpens',
    'commerce.productListView',
    'commerce.productViews',
    'commerce.checkouts',
    'commerce.purchases',
    'userAccount.login',
    'userAccount.createProfile',
    'userAccount.updateProfile',
    'userAccount.logout'
  ].includes(payload.event);
}
```

**Ian Ramsay:** Hi Jonathan — we were discussing this earlier with Julien
and a colleague from the support team who was working on the case,
Christophe. It looks like as you are using the plugin to remove everything
that is not in the current schema. However if you keep ingesting stuff
that has not been implemented at XDM level then the validation errors
will pop up again and again.

We saw that every single field in the error log that we pulled from the
backend is present in the payload, including some of the fields I believe
you were planning to filter out. The erroneous fields are:

```
productListItems.[].__sportssupplements
searchResultsContext
commerce.order.__sportssupplements
searchInputContext
recommendationsContext
categoryContext
changedProductsContext
personID
shoppingCartContext
eventForwardingContext
productContext
productPurchasedId
pageContext
storefrontInstanceContext
```

We would suggest that you test out the attached file in order to validate
what is allowed by the schema.

**Nitin:** Hi Ian — I believe these erroneous fields are getting ingested
in AEP because the plugin was listening to all the event changes in
`adobeDataLayer`, instead it should only listen and send the commerce
events for which the schema is designed. Based on this, Julien updated
the plugin and provided a mechanism to provide a list of events that the
plugin should listen to and forward to CDP.

**Ian Ramsay:** Hi Nitin — I think it would be advisable for either you
or Jonathan to update the existing ticket, or perhaps to create a new one
so that the support team can support you on this.

**Julien:** Nitin, that mechanism is being used and is in the 1st code
snippet in the thread, the `shouldProcessEvent`. My guess is we are
indeed only tracking relevant events now, but the payloads (XDM) is not
matching the schema and being rejected in the backend.

**Ian Ramsay:** Nitin, Jonathan — have you managed to review the payloads
and the schema to see if there is a mismatch?

**Nitin:** Hi Ian — We reviewed the payloads for the commerce events and
they seems to be matching the XDM schema. Julien: I believe the issue
seems to be with martech plugin not able to override the values provided
during initialization. For ex: we add the below code which should restrict
websdk from sending all the events to AEP except
`web.webpagedetails.pageViews`, but it doesn't seem to work.

```javascript
onBeforeEventSend: function(content) {
   return content.xdm.eventType.indexOf('webpagedetails.pageViews') >= 0;
}
```

**Ian Ramsay:** Hi Nitin — thank you for the clarification. Julien is out
of the office currently. I am reaching out to see if other people can
assist in his absence. My understanding is that Julien will be back on
Monday.

**Ian Ramsay:** Hi all, following the call earlier with Ben and Rhys,
apologies for the delay in getting back on this. I had been in contact
with Julien who had provided the following information.

> These are specific questions more related to AEP WebSDK (Alloy) than
> the plugin itself. My understanding is that once you hit
> `onBeforeEventSend` the event is essentially about to be triggered
> already, and there is no way to "stop" it from there. The helper
> function is meant to allow you to modify the XDM payload on the fly,
> and is not a boolean guardrail to stop sending it.
>
> As has been discussed before, the pageview event is enforced on our end
> to properly track Target propositions and report back on experiments
> and personalization. If you specifically want to disable that, you'd
> need to patch the plugin accordingly.
>
> You'd have to look at the 3 areas where we trigger this:
> - When Target is running personalization
> - When personalization is not running
> - When you use a more traditional "bottom of page" event
>
> And that also means you'd have to explicitly handle the page view
> event, and the decisioning results on your own so Analytics still gets
> the relevant data for reporting.

**Nitin:** Hi Ian — Documentation states that function `onBeforeEventSend`
can be used to abort calls to AEP. I believe what we need here is a
mechanism to avoid sending all the datalayer events to AEP and for that
either:

1. We whitelist the events and plugin only send those to AEP: Julien
   added a feature in MarTech plugin for that but that doesn't seem to
   work, or
2. We use `onBeforeEventSend` and whitelist the events manually in the
   code.

**Julien:** Nitin, good catch! I learned something :)

If you explicitly return `false` it will indeed abort sending the event,
and that's indeed not properly handled in our plugin. Let me push a fix
for that.

The fix is in, you can either fetch the latest version or manually patch
your version using commit 3dee3718d2f10404037d8599c591f51dec3bf535.

**Nitin:** Thank you Julien. Does it also fix the event whitelisting
issue that was not working with previous version?

**Julien:** It should :)

**Barry Mann:** Hi all — Nigel and I have discussed this and we are going
to update the martech plugin to pull in this fix, we believe it will
solve the ingestion errors.

[months later]

**Barry Mann:** Hi Julien — I believe you have returned now. I'm looking
for some assistance with the martech plugin, please. May I check, has
`shouldProcessEvent` been tested and working with any other client post
April 2025? We are getting a large number of ingestion errors, those
ingestion errors are corresponding to the state events on ACDL. I call
this 'ACDL Spam'. You can see our staging scripts (without need for VPN)
on https://staging.bulk.com/scripts/scripts.js and
https://staging.bulk.com/plugins/martech/src/index.js. Can you code
review please?

Here is what is happening. I call it 'ACDL Spam', its getting scooped up
by the martech plugin and causing ingestion errors, really I recommend
just blocking the bad ones. Here is the list of stuff I asked our
developer to block: `pageContext productContext shoppingCartContext
changedProductsContext storefrontInstanceContext` — any event containing
"group" in the name (e.g., `productGroupUpdate`, `cartGroupEvent`, etc.)

**Julien:** > has `shouldProcessEvent` been tested and working with any
other client post april 2025?

Yes, we've worked with another customer on this, but it's not a
wide-spread feature so far.

> its getting scooped up by the martech plugin and causing ingestion
> errors

I'm not exactly clear on the issue you have… So you fill the data layer
with various metadata and events. And I'm assuming that the non-events,
like that `storefrontInstanceContext: null` is being picked up for some
reason and passed to analytics? Is that what you mean by "scooped up"?

Barry, if you can share the URL you tested that on, I can try debugging
to see what is happening. But I'm not clear yet on what the issue is that
you are reporting :) In a sense: what's the behavior you are seeing? vs.
what's the behavior you expected?

**Barry Mann:** Hi, I do need some support from Adobe on this as it isn't
working as expected. Yes, the issue is that non-events (mainly context)
are being picked up and going to AEP. We don't have AA or CJA, only
platform. This is what I mean by 'scooped up'. It is on staging so I will
have to make you a video.

```javascript
async function loadEager(doc) {
  let marTechLoadedPromise = null;
  if (isMarTechEnabled()) {
    marTechLoadedPromise = initMartech(
        {
          datastreamId: await getConfigValue('aep-datastream-id'),
          orgId: await getConfigValue('aep-org-id'),
          edgeDomain: await getConfigValue('aep-edge-domain'),
          defaultConsent: 'in'
        },
        {
          personalization: !!getMetadata('target'),
          shouldProcessEvent: (eventName) => {
            const name = String(eventName.event || '').toLowerCase();
            const allowed = new Set([
                'page-view'
            ]);
            const ok = allowed.has(name);
            if (ok) {
                console.log(`Allowed event: ${eventName.event}`);
            } else {
                console.warn(`Blocked event: ${eventName.event}`);
            }
            return ok;
          }
       },
    );
  }
```

So progress has been made... but only if there is a proper event key.
Summary of the problem: On Bulk.com's EDS (Franklin) pages, the MarTech
plugin is forwarding all Adobe Client Data Layer (ACDL) pushes —
including internal *Context updates such as `pageContext`,
`productContext`, and `searchInputContext` — as full AEP events. These
aren't true business events but internal state updates, so they flood
Alloy with invalid payloads ("ACDL spam") and trigger ingestion errors
in AEP. We've added a `shouldProcessEvent` filter that correctly blocks
named ACDL events like `search-request-sent` and `category-results-view`,
but context objects without an event key still bypass this logic. The
plugin needs native suppression for any ACDL push that lacks an event
property or matches `*Context`, so only valid business events (e.g.
`page-view`, `product-page-view`, `add-to-cart`) are emitted to Alloy.

Example state payload:

```json
{
    "pageContext": {
        "pageType": "Product",
        "pageName": "Foam Roller LT2 Test",
        "eventType": "visibilityHidden",
        "maxXOffset": 0,
        "maxYOffset": 0,
        "minXOffset": 0,
        "minYOffset": 0
    },
    "productContext": {
        "productId": 7385,
        "name": "Foam Roller LT2 Test",
        "sku": "BACE-FROL-BLAC-ONES",
        "pricing": {
            "regularPrice": 14.99,
            "specialPrice": 14.99,
            "currencyCode": "GBP"
        }
    },
    "shoppingCartContext": {
        "totalQuantity": 0,
        "items": [],
        "prices": {"subtotalExcludingTax": {}}
    },
    "storefrontInstanceContext": {
        "environmentId": "f933ad10-b86e-42c8-9cae-50fab848cb0b",
        "environment": "Testing",
        "storeUrl": "https://staging.bulk.com/uk"
    },
    "eventForwardingContext": {"commerce": true, "aep": false}
}
```

I believe it is wrapping unwanted context data into an alloy() payload,
I believe this is the root of the problem. It sends it off to alloy as if
it were a legitimate business event (it isn't).

**Julien:** Yes, I get your point! I agree, this needs to be fixed.

I'm just trying to wrap my head around the logic. ACDL should only
trigger the martech logic if you push an ACDL payload with `event`
property. So you are pushing actual "events" to ACDL right? and you just
don't want them forwarded to AEP.

**Barry Mann:** yes that's right... no fake stuff. We just want actual
events, not the fake ones. To be clear only real events should be under
the purview of onBeforeSend. Huddle?

**Julien:** I'm in a meeting at the moment, but can ping you when I'm
done :)

[after call]

**Julien:** Quickly summarizing what we discussed on the call:

- **Symptom:** you have many event ingestion errors and you clearly
  identified that the martech library is bundling too much of the
  datalayer with the event
- **Root cause:** by default the martech library bundles the complete
  ACDL state with every event
- **Solution:** the martech library has a flag `includeDataLayerState`
  that can be set to `false` to ignore the data layer state and only
  process events you explicitly send

We also discussed that the current approach you have to allow listing
events is not easily extensible without additional development cycles, so
we discussed turning it around to a block list instead that would just
block the commerce related events by default.

The change for both comes down to a library configuration issue that we
can easily fix with:

```javascript
// The library config
{
  personalization: !!getMetadata('target'),
  includeDataLayerState: false,  // <=== this fixes the datalayer bundling issue
  shouldProcessEvent: (eventName) => {
    const name = String(eventName.event || '').toLowerCase();
    const blocked = new Set([
      // <=== list the events you do not want to automatically track here
    ]);
    const ok = !blocked.has(name);
    if (ok) {
      console.log(`Allowed event: ${eventName.event}`);
    } else {
      console.warn(`Blocked event: ${eventName.event}`);
    }
    return ok;
  }
},
```

Separate to this, there is also the "decision scopes" discussion going on
with Jonathan, which should address the 2nd major problem you were
facing.

By the way Barry, make sure to disable the chrome overrides after our
session, so you don't constantly run the local patch instead of the
stage code ;) (I sometimes forget disabling them and then waste hours
debugging issues against the wrong code :sweat_smile:)

**Barry Mann:** [testing feedback, then a follow-up question] re: sending
clicks vs pageviews:

```javascript
window.adobeDataLayer.push((dl) => {
  dl.push({
    event: 'page-view',
    eventInfo: { ...dl.getState() }
  });
});
```

This worked just fine, generating a new collect call for the page-view.
Bulk are not a CJA or AA customer, RT-CDP only, so pageview incrementing
is not relevant?

**Julien:** New function above looks good. Just be aware that you are not
filtering out the commerce-related events anymore (which might be what
you wanted anyway).

The snippet to push the page-view looks good, but I'd be careful about
taking the whole `dl.getState()` since this is basically the same as what
`includeDataLayerState: true` was doing. You might end up with XDM
validation errors again. You might want to be more granular in what you
include instead of the whole state.

You could do the "clicks" in a similar way. For a catch-all, something
like this should work:

```javascript
document.addEventListener('click', (ev) => {
  window.adobeDataLayer.push({
    event: 'click',
    eventInfo: { ... }
  });
});
```

Again, just be conscious of what you include in the `eventInfo`. You can
also restrict that to just specific DOM elements, if you don't want all
clicks, but just clicks on relevant buttons, links, etc.

**Barry Mann:** Hi, yes not filtering out commerce related events is what
I want. Re: being more granular, this may mean going through each event
one-by-one and building up some sort of table. Only pushing what I need
for each event? This could take some time to prepare…

**Julien:** > This could take some time to prepare...

Yes, indeed. That was the main reason we included the datalayer state by
default on all events, to avoid having to manually craft all the
payloads. But as we've seen, it has side effects when the payloads are
not exactly following the XDM schemas.

> only pushing what i need for each event?

Correct. That is the alternative you have and that is likely the most
appropriate for your use cases.

**Barry Mann:** Hi, we are waiting for Phase 1 (`includeDataLayerState:
false` alone) to go up to staging. Re: click tracking, isn't it possible
to configure alloy to do that natively rather than pushing 'button-click'
events to the dataLayer?

```javascript
alloy("configure", {
  // … your other settings …
  clickCollectionEnabled: true,  // Enables automatic link click tracking
});
```

could the answer simply be "..martech plugin is not a full Alloy wrapper
.. it's an ACDL first approach .." ?

**Julien:** Oh yes, definitely… completely skipped my mind, but yes,
that's the easiest to set up! You can use any of the configuration
options from the WebSDK with the martech plugin.

Just keep in mind that:

> The Web SDK tracks all clicks on `<a>` and `<area>` HTML elements if it
> doesn't have an `onClick` attribute.

So it's not tracking `<button>` if you have any, and would also skip most
SPA-like onClick events, but I don't think that applies much to the Bulk
website as far as I can see.

**Barry Mann:** Hi, https://staging.bulk.com/scripts/scripts.js is now up
on staging, you ought to be able to inspect it happily off VPN. Testing
results show something positive on ingestion — the new scripts.js went
live at 4pm yesterday, so that lines up. The errored batches have far
fewer errors. However, still seeing large numbers of spurious collect
calls.

Question: is this simply now a question of enabling the block list by
uncommenting it out? Have I misunderstood? Did you mean to say that
`includeDataLayerState: false` should be included along with items in the
block list? It has sprung into life, but why? :)

I really do not have the bandwidth for the event-by-event fix (custom
work), so I will fix up only what is necessary to stand up customer use
cases. Ingestion errors can be endless whack-a-mole :)

**Julien:** I'd look at the event type in the XDM payloads for the
network calls you saw, and then I would specifically add those event
types to the block list you defined.

The `*Context` strings you have are not actual event types, so
uncommenting would have no effect. they were just metadata objects that
got bundled by the `includeDataLayerState` but since you now have that
set to off they should be properly excluded now.

**Barry Mann:** Developer has been asked to drop in the blocked set.
Different topic: what is going on with all the spurious empty collect
call pings? Anything of concern here?

**Julien:** The `*Context` are not actual events, just metadata… they
will not fire the ACDL event, and will not trigger the blocked set you
defined. The blocked set should only contain the list of events you want
to filter out (like `page-view`), not regular metadata.

If you need to remove bad metadata, you should do this via the
`onBeforeEventSend` handler, but that should already be done now with the
`includeDataLayerState` set to false.

**Barry Mann:** Part of the problem here is that it is difficult to
reproduce, since INGEST-1205 errors are file ingestion failures, and it
isn't possible to retrieve the bad file and inspect it. How do I stop
these ingestion errors from reaching platform? The *context bad payload
is happening on a wanted event. We can't just turn this off, I guess we
would need a way to remove the *context stuff from the payload. It feels
like we need another huddle?

**Julien:** You can just remove it from the payload in
`onBeforeEventSend`. you are getting the payload as input in there.

**Barry Mann:** How do I do that in code? `onBeforeEventSend` I am
familiar with in Launch. I saw this example:

```javascript
onBeforeEventSend: function(content) {
   return content.xdm.eventType.indexOf('webpagedetails.pageViews') >= 0;
}
```

however this stops an event on pageview. It's going to be complex to
trim payloads out.

**Julien:** It's project specific. I'd loop in your developers to do this
so you are comfortable maintaining it down the road and evolve it based
on your needs. Something along the lines of `delete payload.xdm.pageContext;`
should roughly do it, but will be dependent on the exact variable name
you use for the payload.

**Barry Mann:** I don't have much developer resource, this is the issue.
They tend to ask for drop-ins ;)

```javascript
initMartech({
  webSDKConfig: {
    onBeforeEventSend: (payload) => {
      try {
        if (payload?.xdm?.pageContext) {
          delete payload.xdm.pageContext;
          console.log('Removed pageContext from payload');
        }

        const contextKeys = [
          'shoppingCartContext',
          'productContext',
          'changedProductsContext',
          'storefrontInstanceContext',
          'shopperContext',
          'aepContext'
        ];

        contextKeys.forEach(k => {
          if (payload?.xdm?.[k]) {
            delete payload.xdm[k];
            console.log(`Removed ${k} from payload`);
          }
        });

        return payload;
      } catch (err) {
        console.error('Error in onBeforeEventSend:', err);
        return payload;
      }
    }
  }
});
```

Is the above of the correct form? Roughly? We will never get to zero
ingestion errors without it.

**Julien:** Almost. You are expected to return a boolean `true` or
`false` to indicate whether the event should be sent (`true`) or blocked
(`false`). So replace `return payload;` with `return true`… and set it
maybe to `false` in the catch block to prevent the invalid ones from
being sent.