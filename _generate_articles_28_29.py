"""Generate articles 28 and 29 (EN only) from the article-27 shell.

Deliberately EN-only: the site is under a site-wide demotion with scaled
generated content as the leading suspect (seo/changelog), and the 16-locale
fan-out of articles 19-27 produced ~0 impressions. These two target
brand-anchored queries the way article-17 does — that is the only article on
the site with real organic traffic.

Idempotent: rewrites the two files from the shell on every run.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SHELL = os.path.join(ROOT, 'articles', 'en', 'article-27.html')

# --------------------------------------------------------------------------
# Article specs
# --------------------------------------------------------------------------

A28 = {
    'num': 28,
    # title_tag drives <title> and is kept under 60 chars incl. brand (R2);
    # title is the longer H1 / og:title / schema headline.
    'title_tag': 'Twitch Closed Captions in 2026 — Compared',
    'title': 'Twitch Closed Captions in 2026: Every Option Compared',
    'desc': 'Every way to get closed captions on a Twitch stream in 2026 — OBS plugin, Stream Closed Captioner, browser sources and viewer-side apps, compared honestly.',
    'keywords': 'twitch closed captions, twitch subtitles, stream closed captioner, obs captions plugin, how to add captions to twitch, twitch cc',
    'breadcrumb': 'Twitch Closed Captions 2026',
    'author': ('Aarav Sharma', 'aarav-sharma', 'Streaming Platforms Engineer, Live Subtitles'),
    'date_iso': '2026-09-05',
    'date_label': 'September 5, 2026',
    'read': '11 min read',
    'img': ('games.webp', 'Dual subtitles over a game scene — English caption with a Japanese translation beneath it'),
    'img_alt_og': 'Dual subtitles over a game scene — English caption with a Japanese translation beneath it',
    'related': [
        ('article-27.html', 'Captions for Streamers in 2026: OBS, Twitch, YouTube Live Workflow'),
        ('article-15.html', 'Discord and Twitch Subtitles: Real-Time Community Workflow'),
        ('article-25.html', 'Live Captions in 2026: How AI-Generated Captions Work and When to Use Them'),
    ],
    'cta_h': 'Subtitles on any stream, whether or not the streamer enabled them',
    'cta_p': 'Live Subtitles captions system audio on your own machine, so every stream gets subtitles — plus real-time translation into 50+ languages.',
    'refs': [
        ('https://stream-cc.gooseman.codes/', 'Stream Closed Captioner — official site'),
        ('https://github.com/ratwithacompiler/OBS-captions-plugin/', 'OBS Captions Plugin — project repository'),
        ('https://help.twitch.tv/s/article/closed-captions', 'Twitch — Closed Captions documentation'),
        ('https://support.google.com/youtube/answer/6373554?hl=en', 'YouTube Help — automatic captioning'),
    ],
    'sections': [
        ('How captions actually reach a Twitch stream', """
<p>Before comparing tools it helps to know that "Twitch captions" is not one feature. Text can reach a viewer's screen by three completely different routes, and every tool in this article picks one of them. The route determines what the tool can and cannot do, far more than its feature list does.</p>
<p><strong>Route 1 — the native caption track.</strong> Twitch supports closed captions carried alongside the video, the same way broadcast television does. Viewers toggle them on or off, they survive into the VOD, and they render in the mobile apps. The broadcaster's software has to inject them into the stream.</p>
<p><strong>Route 2 — a Twitch Extension overlay.</strong> Extensions draw on top of the player using Twitch's own extension runtime. The broadcaster installs and activates the extension; viewers see the overlay on desktop and mobile. The text is not part of the video, so it does not survive into the VOD.</p>
<p><strong>Route 3 — pixels burned into the video.</strong> The broadcaster renders caption text as a source in OBS, so it becomes part of the encoded frame. Everyone sees it, nobody can turn it off, and it is permanent in the VOD.</p>
<p>There is a fourth route Twitch has nothing to do with, and it is the one most viewers actually need: captions generated on the viewer's own machine. More on that below, because it is the only option that does not depend on the streamer.</p>
<p>One thing to be clear about upfront: <strong>Twitch has no first-party automatic captions.</strong> Unlike YouTube Live, there is no setting a streamer can flip to get machine-generated captions from the platform itself. Everything below is third-party.</p>
"""),
        ('Option 1 — the OBS captions plugin (native CC track)', """
<p>The <a href="https://github.com/ratwithacompiler/OBS-captions-plugin/" target="_blank" rel="noopener noreferrer" style="color:#0b6ad1;">OBS captions plugin</a> is the strongest broadcaster-side option, and it takes Route 1: it feeds captions into Twitch's native closed-caption track rather than drawing them on top.</p>
<p>That distinction matters more than it sounds. Because the captions ride in the stream itself, they show up in the Twitch mobile apps, they persist in the VOD, and viewers can turn them off if they find them distracting. Extension overlays do none of those three things.</p>
<p>Practical characteristics worth knowing:</p>
<ul>
    <li>Captioning runs off Google's speech recognition, so it needs a network connection but no local GPU.</li>
    <li>Latency is typically under half a second — small enough that viewers do not read a caption for something that happened two plays ago.</li>
    <li>It can caption only while the microphone source is unmuted and active, which stops it from transcribing whatever is on your desktop between scenes.</li>
    <li>It can write transcripts out as <code>.srt</code> files, which is useful if you re-cut streams into clips later.</li>
    <li>It supports open captions through an OBS text source for destinations that have no native CC support.</li>
    <li>Language support is solid for languages with western character sets and thinner elsewhere.</li>
</ul>
<p>The significant limitation is structural: it is an OBS plugin. <strong>Streamlabs does not load OBS plugins</strong>, so if your entire setup is built on Streamlabs this option is closed to you without migrating.</p>
"""),
        ('Option 2 — Stream Closed Captioner (Twitch Extension)', """
<p><a href="https://stream-cc.gooseman.codes/" target="_blank" rel="noopener noreferrer" style="color:#0b6ad1;">Stream Closed Captioner</a> is the best-known caption extension on Twitch and takes Route 2. The broadcaster installs the extension, signs in on the companion site, and clicks on when going live; the site handles speech recognition from the broadcaster's microphone and pushes text to the overlay.</p>
<p>For broadcasters it is free to install and run. The paid element sits on translation: viewers who want captions translated spend Bits to unlock translation for a 24-hour window, historically 500 Bits, which covers the machine-translation bill. The translation language set has stayed small — English, German, Spanish and French in the coverage available at the time of writing.</p>
<p>Two things to weigh before committing to it. First, because it is an overlay rather than a caption track, the text does not survive into your VOD, so clip and highlight viewers get nothing. Second, it is a developer-run, self-funded project; that is not a criticism of its quality, but it does mean you should check the announcements page before you rely on it for an important broadcast.</p>
<p>It has one clear advantage over the OBS plugin: it does not care what broadcasting software you use. Streamlabs, XSplit, Twitch Studio — the extension runs on Twitch's side, so your encoder is irrelevant.</p>
"""),
        ('Option 3 — browser-source caption services', """
<p>A third family of tools runs captioning in the cloud and hands you a URL you drop into OBS, Streamlabs or XSplit as a browser source. The text renders into your scene, which makes this Route 3: burned into the video.</p>
<p>These services are where most of the multilingual capability in this category lives. Because translation happens server-side, they typically offer far more target languages than an extension does, and several support showing two languages at once for bilingual audiences.</p>
<p>The trade-offs are consistent across the category. Burned-in captions cannot be turned off by a viewer who does not want them, and they occupy fixed screen real estate you must design around — which is precisely how captions end up covering a kill feed or a webcam. They also add a monthly bill, usually in the few-dollars-per-month range, and they introduce a dependency: if the service is down, your captions are down mid-stream.</p>
<p>If your audience is genuinely international and you are willing to pay and to lay out your scene around a caption bar, this is the most capable broadcaster-side option. If not, the OBS plugin gives you more of what most streams need for free.</p>
"""),
        ('Option 4 — viewer-side caption apps', """
<p>Every option above shares one assumption: that the streamer did something. As a viewer, that assumption fails most of the time. The overwhelming majority of Twitch channels run no captioning at all, and you cannot install anything on someone else's stream.</p>
<p>Viewer-side apps invert the problem. Instead of hooking into Twitch, they transcribe the audio already playing on your own machine and draw subtitles in a floating overlay on your screen. Nobody else sees them, and the streamer's setup is irrelevant — if you can hear it, it gets captioned.</p>
<p>This is what <a href="/twitch-live-captions.html" style="color:#0b6ad1;">Live Subtitles does for Twitch</a>, and the practical consequences are worth spelling out:</p>
<ul>
    <li>It works on every channel, including channels that have never heard of captioning.</li>
    <li>It is not Twitch-specific — the same overlay captions a YouTube Live stream, a Kick stream, a Discord call or a video in a browser tab, with no reconfiguration.</li>
    <li>It handles translation for the viewer rather than the broadcaster, across 50+ language pairs, with the original and the translation shown at the same time.</li>
    <li>It has a click-through Game Mode, so captions stay readable over a fullscreen game if you watch a stream while playing.</li>
</ul>
<p>The equally important limitation: <strong>your viewers will never see these captions if you are the one streaming.</strong> A viewer-side overlay solves a viewer's problem. If you want your audience captioned, you need one of Options 1-3. Many streamers end up running both — a broadcaster-side tool for the audience, and a viewer-side overlay so they can follow a foreign-language co-streamer or game themselves.</p>
"""),
        ('Side-by-side comparison', """
<table>
    <tr>
        <th>&nbsp;</th>
        <th>OBS captions plugin</th>
        <th>Stream Closed Captioner</th>
        <th>Browser-source service</th>
        <th>Viewer-side app</th>
    </tr>
    <tr><td><strong>Who installs it</strong></td><td>Streamer</td><td>Streamer</td><td>Streamer</td><td>Viewer</td></tr>
    <tr><td><strong>Delivery route</strong></td><td>Native CC track</td><td>Extension overlay</td><td>Burned into video</td><td>Overlay on your own screen</td></tr>
    <tr><td><strong>Viewers can toggle off</strong></td><td>Yes</td><td>Yes</td><td>No</td><td>N/A — only you see it</td></tr>
    <tr><td><strong>Survives into the VOD</strong></td><td>Yes</td><td>No</td><td>Yes, permanently</td><td>No</td></tr>
    <tr><td><strong>Works in Twitch mobile apps</strong></td><td>Yes</td><td>Yes</td><td>Yes</td><td>Desktop and mobile app, viewer-side</td></tr>
    <tr><td><strong>Encoder requirement</strong></td><td>OBS only, not Streamlabs</td><td>Any</td><td>Any with browser sources</td><td>None</td></tr>
    <tr><td><strong>Translation</strong></td><td>Limited</td><td>Few languages, Bits-gated</td><td>Broad</td><td>50+ pairs, dual display</td></tr>
    <tr><td><strong>Works on channels with no setup</strong></td><td>No</td><td>No</td><td>No</td><td>Yes</td></tr>
    <tr><td><strong>Typical cost</strong></td><td>Free</td><td>Free; viewers pay Bits for translation</td><td>Subscription</td><td>Paid app, free trial</td></tr>
</table>
"""),
        ('Which option actually fits your situation', """
<h3>You are a viewer</h3>
<p>Options 1-3 are not available to you in any meaningful sense — you would be waiting for thousands of individual streamers to each set something up. A viewer-side app is the only route that works across the channels you actually watch. If your reason for wanting captions is that the stream is in a language you do not speak, this is doubly true, since broadcaster-side translation is rare and narrow.</p>
<h3>You stream on OBS to an English-speaking audience</h3>
<p>Use the OBS captions plugin. It is free, it takes about ten minutes to set up, it uses the native caption track so viewers keep control, and the captions survive into your VODs and clips. There is little reason to pay for anything else at this stage.</p>
<h3>You stream on Streamlabs, XSplit or Twitch Studio</h3>
<p>The OBS plugin is unavailable, so Stream Closed Captioner is the natural default — it runs on Twitch's side and does not care about your encoder. Accept that your VODs will be uncaptioned.</p>
<h3>You have a genuinely multilingual audience</h3>
<p>This is the one case that justifies a paid browser-source service, because broad translation is the thing free tools do worst. Budget scene space for the caption bar before you go live rather than after.</p>
<h3>You are a streamer who also watches other streams</h3>
<p>Run both layers. They solve different problems and do not conflict: a broadcaster-side tool for your audience, and a viewer-side overlay for raids, collabs and foreign-language games where you need to follow along yourself.</p>
"""),
        ('The gap none of these fully closes', """
<p>Across every broadcaster-side option, translation is the weak point. The free tools handle a handful of languages; the paid ones handle more but bill monthly and burn the result into the frame for everyone. Meanwhile the audience for a mid-size Twitch channel is routinely spread across a dozen languages.</p>
<p>Structurally, this is hard to fix from the broadcaster's side. A single burned-in caption bar can only display one or two languages at once, and a caption track carries one language. Serving twelve languages from the stream would mean twelve tracks and twelve translation bills, for an audience the streamer cannot see the language breakdown of.</p>
<p>The same problem is straightforward from the viewer's side, because each viewer only needs one language: their own. That asymmetry is the practical reason viewer-side captioning exists as a category at all, and why the two approaches complement each other rather than compete. Our <a href="/live-stream-subtitles.html" style="color:#0b6ad1;">live stream subtitles guide</a> covers the viewer-side setup across platforms, and the <a href="/obs-subtitles.html" style="color:#0b6ad1;">OBS subtitles page</a> covers where the line falls in a streaming rig.</p>
"""),
        ('Frequently asked questions', """
<h3>Does Twitch have automatic captions?</h3>
<p>No. Twitch has no first-party automatic captioning. It supports a closed-caption track that broadcaster software can fill, but the platform will not generate captions for you the way YouTube Live does.</p>
<h3>Can I get captions on a stream that has no captions?</h3>
<p>Yes, but only from your side. A viewer-side app transcribes the audio playing on your own machine, so it works regardless of what the streamer has or has not set up.</p>
<h3>Will captions show up in my VOD?</h3>
<p>Only with the native caption track (OBS captions plugin) or burned-in captions from a browser source. Extension overlays are rendered by the Twitch player at watch time and are not part of the recorded video.</p>
<h3>Do captions work in the Twitch mobile app?</h3>
<p>Native caption tracks and extension overlays both render on mobile. Burned-in captions appear everywhere by definition, since they are part of the video.</p>
<h3>Can I caption a Twitch stream in another language?</h3>
<p>Broadcaster-side translation exists but is narrow — a few languages, often behind Bits or a subscription. Viewer-side translation is much broader, because each viewer only needs their own language rather than all of them at once.</p>
"""),
    ],
}

A29 = {
    'num': 29,
    'title_tag': 'Web Captioner Alternatives in 2026',
    'title': 'Web Captioner Alternatives in 2026: What to Use Now That It Is Gone',
    'desc': 'Web Captioner went offline in 2023. Here are the real alternatives in 2026 for churches, classrooms, events and streams — browser tools, overlays and OBS.',
    'keywords': 'web captioner alternative, webcaptioner replacement, free live captions, browser live captioning, live caption software, real-time captions app',
    'breadcrumb': 'Web Captioner Alternatives 2026',
    'author': ('Lukas Bergström', 'lukas-bergstrom', 'Real-time Pipelines Engineer, Live Subtitles'),
    'date_iso': '2026-09-05',
    'date_label': 'September 5, 2026',
    'read': '10 min read',
    'img': ('meetings.webp', 'Live dual subtitles on a video call — English speech with a French translation beneath it'),
    'img_alt_og': 'Live dual subtitles on a video call — English speech with a French translation beneath it',
    'related': [
        ('article-25.html', 'Live Captions in 2026: How AI-Generated Captions Work and When to Use Them'),
        ('article-24.html', 'Transcribe Audio to Text in 2026: Real-Time vs Batch Transcription Compared'),
        ('article-27.html', 'Captions for Streamers in 2026: OBS, Twitch, YouTube Live Workflow'),
    ],
    'cta_h': 'A caption overlay that runs on your machine, not in a tab',
    'cta_p': 'Live Subtitles captions system audio or a microphone in a floating window you can place anywhere — with real-time translation into 50+ languages.',
    'refs': [
        ('https://obsproject.com/', 'OBS Studio — official site'),
        ('https://github.com/ratwithacompiler/OBS-captions-plugin/', 'OBS Captions Plugin — project repository'),
        ('https://support.google.com/youtube/answer/6373554?hl=en', 'YouTube Help — automatic captioning'),
        ('https://www.w3.org/WAI/media/av/captions/', 'W3C WAI — Captions and subtitles guidance'),
    ],
    'sections': [
        ('What happened to Web Captioner', """
<p>Web Captioner went offline in late 2023, and the reason given was sustainability — a free service with real running costs and no revenue behind it. For several years it had been the default answer to "we need live captions and we have no budget": you opened a browser tab, clicked start, and text appeared on screen.</p>
<p>The people it left behind were a specific crowd. Small churches projecting captions for the congregation. Teachers captioning a lesson for a hard-of-hearing student. Community meetings, local council sessions, conference side rooms, and streamers who wanted captions without buying anything. None of these had the budget for enterprise captioning, and most of them had no replacement lined up.</p>
<p>Two and a half years on, the gap has been filled — but not by a single successor. What replaced Web Captioner is four different categories of tool, each of which covers part of what it did. Which one you want depends almost entirely on where the captions need to appear.</p>
"""),
        ('The bar a replacement has to clear', """
<p>It is worth being precise about what made Web Captioner good, because "live captioning tool" covers products that are nothing like it.</p>
<ul>
    <li><strong>Zero install.</strong> It ran in a browser tab. No admin rights, which mattered enormously on locked-down school and church computers.</li>
    <li><strong>Zero cost.</strong> Not a trial, not a freemium tier with a watermark.</li>
    <li><strong>Zero account.</strong> You did not sign up; you clicked start.</li>
    <li><strong>Big readable output.</strong> Full-screen text designed to be projected, not a small transcript pane.</li>
    <li><strong>Immediate.</strong> Setup was measured in seconds, which is what made it usable by a volunteer five minutes before a service started.</li>
</ul>
<p>Almost no tool in 2026 hits all five. Being honest about which ones you actually need is the fastest way to choose.</p>
"""),
        ('Category 1 — browser-based captioning tools', """
<p>The closest philosophical successors are browser tools that run speech recognition in the tab. Several now run Whisper-family models compiled to run in the browser rather than calling a cloud speech API, which has two consequences: language coverage is much wider than Web Captioner's was, and once the model is cached the tool can work with no network at all.</p>
<p>These are the right answer if the original appeal was "no install, no account, projected on a screen." A pop-out or full-screen caption view gives you the projector display Web Captioner was used for, and the browser requirement is a feature rather than a limitation on machines where you cannot install software.</p>
<p>What to check before you rely on one: whether the model downloads on every visit or caches, how it behaves when the laptop is on battery (in-browser inference is heavy), and whether it can caption <em>system</em> audio or only the microphone. That last one decides whether it can caption a video you are playing, or only a person speaking in the room.</p>
"""),
        ('Category 2 — desktop caption overlays', """
<p>The second category moved the job out of the browser entirely. A desktop app captures audio at the operating-system level and draws captions in a floating window that sits above everything else on screen.</p>
<p>This buys you three things a browser tab structurally cannot. It can caption <strong>system audio</strong> — anything playing on the machine, including a video, a call, or a stream — rather than only a microphone. The overlay floats above fullscreen applications instead of living inside a tab you have to keep visible. And because it is not competing with a browser's audio permissions, it keeps working when you switch apps.</p>
<p>Live Subtitles sits in this category — a desktop app on Windows and macOS, with mobile apps for iOS and Android. Relative to the Web Captioner checklist above it wins on capability and loses on two points worth stating plainly: <strong>it requires an install</strong>, which rules it out on locked-down machines, and <strong>it is a paid app with a free trial</strong> rather than free forever. If your requirement was strictly "free and installable by nobody," a browser tool is the honest recommendation and Category 1 is where you should look.</p>
<p>Where it clearly wins is anything involving translation or media audio: dual subtitles showing the original and a translation at once, 50+ language pairs, and captions for content playing on the machine rather than speech in the room. See <a href="/any-app-live-captions.html" style="color:#0b6ad1;">live captions for any app</a> for how the system-audio approach works in practice.</p>
"""),
        ('Category 3 — OBS and streaming setups', """
<p>A meaningful share of Web Captioner's users were pointing a browser window at OBS, capturing it as a source, and burning the captions into a stream or a recording. If that was your setup, you do not need a Web Captioner replacement at all — you need a proper streaming caption tool.</p>
<p>The <a href="https://github.com/ratwithacompiler/OBS-captions-plugin/" target="_blank" rel="noopener noreferrer" style="color:#0b6ad1;">OBS captions plugin</a> does this natively and better than the window-capture hack ever did. It transcribes your microphone source directly, keeps latency under about half a second, can write transcripts out as <code>.srt</code>, and on platforms that support closed captions it feeds the native caption track — so viewers can toggle captions on or off instead of having them permanently burned into the frame.</p>
<p>The one incompatibility to know about: it is an OBS plugin, and Streamlabs does not load OBS plugins. On Streamlabs or XSplit you are looking at a browser-source captioning service instead. Our <a href="/obs-subtitles.html" style="color:#0b6ad1;">OBS subtitles guide</a> covers how these layers fit together in a real rig.</p>
"""),
        ('Category 4 — platform-native captions', """
<p>If your event is streamed rather than in-person, the platform may caption it for you at no cost. This is the cheapest option available and the most commonly overlooked.</p>
<p>The catch is how narrow the coverage is. YouTube Live generates automatic captions, but <strong>in English only</strong>, on normal-latency streams, and enabled per stream by the creator rather than once for a channel. Viewers can layer auto-translate on top, which means translating an already-imperfect English transcript — usable, but noticeably rougher than translating from clean text. Meeting platforms like Zoom, Teams and Google Meet all caption natively now, with varying language support. Twitch and Kick have no first-party automatic captioning at all.</p>
<p>For a straightforward English-language stream on a platform that supports it, native captions cost nothing and require no extra software. For anything multilingual, or for an in-person event, they will not carry the load.</p>
"""),
        ('Side-by-side comparison', """
<table>
    <tr>
        <th>&nbsp;</th>
        <th>Browser tools</th>
        <th>Desktop overlay</th>
        <th>OBS plugin</th>
        <th>Platform-native</th>
    </tr>
    <tr><td><strong>Install required</strong></td><td>No</td><td>Yes</td><td>Yes (OBS)</td><td>No</td></tr>
    <tr><td><strong>Cost</strong></td><td>Often free</td><td>Paid, free trial</td><td>Free</td><td>Free</td></tr>
    <tr><td><strong>Captions system audio</strong></td><td>Varies</td><td>Yes</td><td>Configurable</td><td>N/A</td></tr>
    <tr><td><strong>Projector / big-screen output</strong></td><td>Yes</td><td>Yes, resizable overlay</td><td>Via OBS scene</td><td>No</td></tr>
    <tr><td><strong>Goes into a stream for viewers</strong></td><td>Via window capture</td><td>Via window capture</td><td>Yes, natively</td><td>Yes</td></tr>
    <tr><td><strong>Translation</strong></td><td>Varies</td><td>50+ pairs, dual display</td><td>Limited</td><td>English-first, limited</td></tr>
    <tr><td><strong>Works offline</strong></td><td>Some, once cached</td><td>Depends on model</td><td>No</td><td>No</td></tr>
    <tr><td><strong>Closest to Web Captioner</strong></td><td>Yes</td><td>Partly</td><td>No</td><td>No</td></tr>
</table>
"""),
        ('Picking by use case', """
<h3>Church, classroom or community meeting</h3>
<p>A browser tool is the closest replacement and usually the right one. It keeps the properties that mattered — no install, no account, no cost, projectable — and modern ones cover far more languages than Web Captioner did. Test it on the actual machine and the actual microphone before the day; room audio is what breaks live captioning, not the software.</p>
<h3>Captioning a video, a call or a stream you are watching</h3>
<p>Browser tools that only hear the microphone cannot do this. You want a desktop overlay that captions system audio, which also gets you translation if the content is not in your language.</p>
<h3>Streaming to an audience</h3>
<p>Use the OBS captions plugin if you are on OBS, or a browser-source captioning service if you are not. Do not capture a caption webpage in a window source; it was always a workaround and there are now proper tools for the job.</p>
<h3>A conference or a paid event</h3>
<p>This is the one case where the paid event-captioning services earn their price. Attendee-device caption delivery via a URL or QR code, integrations with presentation software, and accountable accuracy are things the free tier of this category does not provide.</p>
"""),
        ('What you give up, whichever you choose', """
<p>Two limitations are common to every option and are worth setting expectations around, because they are properties of live speech recognition rather than flaws in any particular product.</p>
<p><strong>Accuracy tracks audio quality, not price.</strong> A clear voice on a decent microphone in a quiet room transcribes well on nearly all of these tools. A room with reverberation, several people talking over each other, or a laptop microphone three metres from the speaker degrades all of them. If you can only improve one thing, improve the microphone rather than the software.</p>
<p><strong>Proper nouns are the recurring failure.</strong> Names, places, product names and jargon are exactly what a general-purpose model has least reason to predict, and exactly what an audience notices getting mangled. Tools that support a custom vocabulary are worth choosing for this reason alone if your content is full of specific terminology.</p>
<p>Neither of these was solved by Web Captioner either. What has genuinely improved since 2023 is language coverage and the ability to run models locally — both a direct result of the shift from cloud speech APIs to Whisper-family models small enough to run on ordinary hardware.</p>
"""),
        ('Frequently asked questions', """
<h3>Is Web Captioner coming back?</h3>
<p>There has been no indication of a return since it went offline in late 2023. Plan around a replacement rather than waiting.</p>
<h3>What is the closest free replacement?</h3>
<p>A browser-based captioning tool. That category preserves what made Web Captioner useful — no install, no account, no cost, projectable output — and generally supports more languages than it did.</p>
<h3>Can any of these caption audio from a video instead of a microphone?</h3>
<p>Desktop overlays can, because they capture audio at the operating-system level. Browser tools vary, and many are microphone-only. Check this specifically if you need to caption media playback rather than someone speaking in the room.</p>
<h3>Which option translates as well as it captions?</h3>
<p>Desktop overlays and paid browser-source services lead here. Free browser tools and platform-native captions are English-first, and platform auto-translate works by translating an already-imperfect transcript.</p>
<h3>Do I need an internet connection?</h3>
<p>Not always. Tools built on locally-run Whisper-family models can work offline once the model is cached. Anything calling a cloud speech API, including the OBS captions plugin and platform-native captions, requires a connection.</p>
"""),
    ],
}


# --------------------------------------------------------------------------
# Rendering
# --------------------------------------------------------------------------

def render(spec: str, shell: str) -> str:
    s = spec
    num = s['num']
    url = f'https://live-subtitles.com/articles/en/article-{num}.html'
    img_file, img_alt = s['img']
    img_url = f'https://live-subtitles.com/articles/img/en/{img_file}'
    author_name, author_slug, author_title = s['author']

    out = shell

    # ---- head ----
    out = re.sub(r'<title>.*?</title>', f'<title>{s["title_tag"]} | Live Subtitles</title>', out, count=1)
    out = re.sub(r'(<meta name="description" content=").*?(">)', lambda m: m.group(1) + s['desc'] + m.group(2), out, count=1)
    out = re.sub(r'(<meta name="keywords" content=").*?(">)', lambda m: m.group(1) + s['keywords'] + m.group(2), out, count=1)
    out = out.replace('https://live-subtitles.com/articles/en/article-27.html', url)
    out = re.sub(r'(<meta property="og:title" content=").*?(">)', lambda m: m.group(1) + s['title'] + m.group(2), out, count=1)
    out = re.sub(r'(<meta property="og:description" content=").*?(">)', lambda m: m.group(1) + s['desc'] + m.group(2), out, count=1)
    out = re.sub(r'(<meta name="twitter:title" content=").*?(">)', lambda m: m.group(1) + s['title'] + m.group(2), out, count=1)
    out = re.sub(r'(<meta name="twitter:description" content=").*?(">)', lambda m: m.group(1) + s['desc'] + m.group(2), out, count=1)
    out = out.replace('https://live-subtitles.com/articles/img/en/games.webp', img_url)
    out = out.replace('/articles/img/en/games.webp', f'/articles/img/en/{img_file}')
    out = re.sub(r'(<meta property="og:image:alt" content=").*?(">)', lambda m: m.group(1) + s['img_alt_og'] + m.group(2), out, count=1)
    # real intrinsic size of the article images is 1280x719; the shell declares 781
    out = out.replace('<meta property="og:image:height" content="781">', '<meta property="og:image:height" content="719">')

    # Article JSON-LD
    out = re.sub(r'"headline": ".*?"', f'"headline": {json_str(s["title"])}', out, count=1)
    out = re.sub(r'"datePublished": ".*?"', f'"datePublished": "{s["date_iso"]}"', out, count=1)
    out = re.sub(r'"dateModified": ".*?"', f'"dateModified": "{s["date_iso"]}"', out, count=1)
    out = re.sub(
        r'"author": \{.*?\},',
        f'"author": {{ "@type": "Person", "name": {json_str(author_name)}, "url": "https://live-subtitles.com/about/team/{author_slug}.html", "jobTitle": {json_str(author_title)} }},',
        out, count=1)
    out = re.sub(r'"description": ".*?"', f'"description": {json_str(s["desc"])}', out, count=1)

    # BreadcrumbList: the shell points Home at /en/, which is not a real URL on this site
    out = out.replace('"item": "https://live-subtitles.com/en/"', '"item": "https://live-subtitles.com/"')
    out = re.sub(r'("position": 3, "name": ").*?(")', lambda m: m.group(1) + s['breadcrumb'] + m.group(2), out, count=1)

    # FAQPage schema, derived from the visible FAQ section so the two cannot drift
    faq = build_faq_schema(s)
    if faq:
        out = out.replace('    </script>\n    <link rel="preload"', '    </script>\n' + faq + '    <link rel="preload"', 1)

    # ---- toc rail ----
    rail = ['    <nav class="toc-rail" aria-label="Contents">', '        <div class="toc-inner">', '            <h4>Contents</h4>']
    for i, (h, _) in enumerate(s['sections'], 1):
        label = h if len(h) <= 34 else h[:34].rstrip() + '…'
        rail.append(f'            <a href="#sec-{i}">{label}</a>')
    rail.append(f'            <a href="#sec-{len(s["sections"]) + 1}">References</a>')
    rail.append('            </div>')
    rail.append('    </nav>')
    out = re.sub(r'    <nav class="toc-rail".*?    </nav>', '\n'.join(rail), out, count=1, flags=re.S)

    # ---- title block ----
    head_block = (
        f'        <h1 class="article-title" itemprop="headline">{s["title"]}</h1>\n'
        f'        <div class="article-date" itemprop="datePublished" content="{s["date_iso"]}">{s["date_label"]}<span class="reading-time">{s["read"]}</span></div>\n'
        f'        <div class="article-author" style="color:#5b6470; font-size:0.95rem; margin-bottom:1.5rem;">By: <a href="https://live-subtitles.com/about/team/{author_slug}.html" rel="author" style="color:#0b6ad1; text-decoration:none;">{author_name}</a> &middot; {author_title}</div>\n'
        f'        <div class="article-updated" itemprop="dateModified" content="{s["date_iso"]}" style="color:#5b6470; font-size:0.9rem; margin-bottom:1.5rem;">Updated: {s["date_label"]}</div>\n'
        f'        <img class="article-hero" src="/articles/img/en/{img_file}" alt="{img_alt}" width="1280" height="719" loading="eager" decoding="async" fetchpriority="high" style="display:block; width:100%; height:auto; border-radius:8px; margin:0 0 1.5rem 0;">\n'
    )
    out = re.sub(r'        <h1 class="article-title".*?<img class="article-hero".*?>\n', head_block, out, count=1, flags=re.S)

    # ---- body ----
    n_sec = len(s['sections'])
    toc_items = ''.join(f'<li><a href="#sec-{i}">{h}</a></li>' for i, (h, _) in enumerate(s['sections'], 1))
    toc_items += f'<li><a href="#sec-{n_sec + 1}">References</a></li>'

    body = ['        <div itemprop="articleBody">']
    body.append(f'            <p>{s["intro"]}</p>')
    body.append('')
    body.append(f'            <details class="toc-mobile"><summary>Contents</summary><ol>{toc_items}</ol></details>')
    for i, (h, html) in enumerate(s['sections'], 1):
        body.append('')
        body.append(f'            <h2 id="sec-{i}">{h}</h2>')
        for line in html.strip().split('\n'):
            body.append('            ' + line)
    body.append('')
    body.append(f'            <h2 id="sec-{n_sec + 1}">References</h2>')
    body.append('            <ul>')
    for href, label in s['refs']:
        body.append(f'                <li><a href="{href}" target="_blank" rel="noopener noreferrer" style="color:#0b6ad1;">{label}</a></li>')
    body.append('            </ul>')
    body.append('')
    body.append('            <div style="background: rgba(0,184,255,0.08); border-left: 4px solid #0b6ad1; padding: 1.2rem; border-radius: 0 8px 8px 0; margin: 2rem 0;">')
    body.append('                <h3 style="color: #0b6ad1; margin-top: 0;">Related reading</h3>')
    body.append('                <ul style="list-style: none; padding-left: 0;">')
    for href, label in s['related']:
        body.append(f'                    <li><a href="{href}" style="color: #0b6ad1; text-decoration: none;">{label}</a></li>')
    body.append('                </ul>')
    body.append('            </div>')
    body.append('')
    body.append('            <div style="background: linear-gradient(135deg, rgba(0,255,157,0.1), rgba(0,184,255,0.1)); border: 1px solid rgba(0,255,157,0.3); border-radius: 12px; padding: 2rem; margin: 2rem 0; text-align: center;">')
    body.append(f'                <h3 style="color: #0a7f55; margin-top: 0;">{s["cta_h"]}</h3>')
    body.append(f'                <p style="color: #2d333b; margin-bottom: 1.5rem;">{s["cta_p"]}</p>')
    body.append('                <a href="https://apps.microsoft.com/store/detail/9PH1R9DJG47S" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: linear-gradient(135deg, #00ff9d, #00b8ff); color: #1f2328; text-decoration: none; border-radius: 8px; font-weight: 600;" class="js-store-cta">Download free</a>')
    body.append('            </div>')
    body.append('        </div>')
    body.append('    </div>')

    start = out.index('        <div itemprop="articleBody">')
    end = out.index('<div class="explore-block">')
    tail_ws = out[out.rindex('</div>', start, end) + len('</div>'):end]
    out = out[:start] + '\n'.join(body) + tail_ws + out[end:]

    return out


def json_str(v: str) -> str:
    return '"' + v.replace('\\', '\\\\').replace('"', '\\"') + '"'


def build_faq_schema(spec: dict) -> str:
    """Build FAQPage JSON-LD from the article's visible FAQ section.

    Derived rather than duplicated so the schema cannot drift from the page —
    Google treats a FAQPage whose questions are not on the page as a violation.
    """
    section = next((html for h, html in spec['sections'] if 'frequently asked' in h.lower()), None)
    if not section:
        return ''
    pairs = re.findall(r'<h3>(.*?)</h3>\s*<p>(.*?)</p>', section, re.S)
    if not pairs:
        return ''
    strip = lambda t: re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
    entities = ',\n'.join(
        '        {\n'
        '          "@type": "Question",\n'
        f'          "name": {json_str(strip(q))},\n'
        f'          "acceptedAnswer": {{ "@type": "Answer", "text": {json_str(strip(a))} }}\n'
        '        }'
        for q, a in pairs
    )
    return (
        '    <script type="application/ld+json">\n'
        '    {\n'
        '      "@context": "https://schema.org",\n'
        '      "@type": "FAQPage",\n'
        '      "mainEntity": [\n'
        + entities + '\n'
        '      ]\n'
        '    }\n'
        '    </script>\n'
    )


A28['intro'] = (
    'Twitch is the largest live platform with no first-party automatic captions. Everything that puts text on a '
    'Twitch stream in 2026 is third-party, and the options are not interchangeable — they differ in who has to '
    'install them, whether viewers can switch them off, whether they survive into the VOD, and whether they work at '
    'all on a channel that has never set anything up. This guide walks through every route captions can take to a '
    'Twitch viewer, what each one costs, and which one fits depending on whether you are watching or broadcasting.'
)

A29['intro'] = (
    '<strong>Web Captioner</strong> went offline in late 2023 and has not returned. For years it was the default '
    'free answer for live captions — a browser tab, one click, big readable text on a projector — and its shutdown '
    'left churches, classrooms, community events and streamers without a replacement. Two and a half years on, '
    'nothing has replaced it one-for-one. What exists instead is four categories of tool, each covering part of what '
    'it did. This guide covers what each one is good at, what it costs, and which one to pick for your situation.'
)


def main():
    with open(SHELL, 'r', encoding='utf-8') as f:
        shell = f.read()

    for spec in (A28, A29):
        out = render(spec, shell)
        fp = os.path.join(ROOT, 'articles', 'en', f'article-{spec["num"]}.html')
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(out)
        text = re.sub(r'<[^>]+>', ' ', re.sub(r'(?s)<script.*?</script>|<style.*?</style>|<head>.*?</head>', '', out))
        print(f'  article-{spec["num"]}.html written — {len(text.split())} words')


if __name__ == '__main__':
    main()
