<style lang="scss" scoped>
img.app-store {
  height: 5rem;
}

.modals a {
  width: 50%;
  padding: 1rem;
}
</style>

<template>
  <div class="container">

    <section id="bftn-action-form">
      <loader-logo></loader-logo>
      <h1 class="text-center">Red Alert for Net Neutrality!</h1>
      <call-form v-if="isCallPage" page="call"></call-form>
      <petition-form v-else />
    </section>

    <section id="stats">
      <h2>Together, we're making a difference</h2>
      <p>Ever since the FCC began working to destroy Title II net neutrality protections, we've been working twice as hard to show our government how much the American public supports a truly free and open internet ... without censorship, unfair fees or throttling.  Here's what we've been able to accomplish so far:</p>
      <battle-stats></battle-stats>
    </section>

    <section id="join">
      <h2>Do you run a website? Use it to join the Red Alert.</h2>
      <p>Congress can vote to stop the FCC, but to make that happen we need a massive volume of phone calls to Congress. Sites will go on Red Alert from May 9th until the Senate votes a week or so later. Can you join us for all or some of it?</p>
      <p>If you have a website, you can display a prominent alert on your site that asks your visitors to contact Congress. <a href="https://www.fightforthefuture.org?redalert">Click here for a demo</a>, <a href="https://github.com/fightforthefuture/redalert-widget">grab the code on GitHub</a>, or use <a href="https://drive.google.com/drive/folders/1OM5CZ5qGpRc3RdD8AfHwWuVOajZorw-g">one of these banners</a>. The alert will appear once per user per day and users can easily click away. You can link the banners directly to this website. <strong>Add this line of code to your site's header!</strong></p>
      <code>&lt;script src="https://redalert.battleforthenet.com/widget.js" async&gt;&lt;/script&gt;</code>
      <div class="modals flex-center">
        <img src="/images/redalert/modal-minimized-preview@2x.jpg"
          alt="A screenshot of our Red Alert modal when minimized"
          class="rounded">
      </div>
    </section>

    <section id="onemorevote">
      <h2>The Senate is about to vote on whether to save net neutrality or let it die.</h2>
      <p>Ajit Pai's FCC wants to let cable companies control which websites and apps you use, where you get your news, how you listen to music and watch videos -- everything you do on the Internet. But the US Senate will vote in mid-May on a resolution to block the FCC's repeal of net neutrality and keep the web free and open. <b><a href="/redalert">Starting May 9th through the vote itself, we're calling on websites and social media users to "go red" as part of our Red Alert for Net Neutrality to help sound the alarm. Join us!</a></b></p>
    </section>

    <section id="scoreboard">
      <h2>Contact Congress now to show your support for net neutrality.</h2>
      <p>Below you'll find a list of your state's senators and representatives.  The ones in green support net neutrality, so let them know you appreciate their support.  The ones in red need to be convinced, so let them know how important this issue is to you.  Then target the <a href="/scoreboard/#senate">49 undecided senators</a>. Once we win the Senate, the fight moves to the House, where we need over 25 Republican votes to win. So please tweet and call your senators, then tweet and call your representatives!</p>
      <scoreboard :summary="true"></scoreboard>
    </section>

    <section id="events">
      <h2>There are protests all over the country on Monday May 14th. Join one near you.</h2>
      <p><strong>Want to make your voice heard?</strong> Check out the map below to find a protest or a meeting with a representative in your state.  And if there are no events in your area, consider organizing one!</p>
      <iframe class="events-map" src="https://events.battleforthenet.com/iframe"></iframe>
    </section>

    <section id="team-internet">
      <h2>We are Team Internet. We support net neutrality, freedom of speech.</h2>
      <p>These companies and organizations have been champions of net neutrality and participated in campaigns to save it:</p>
      <ul class="logo-grid">
        <li><img src="/images/logos/fftf.png" alt="Fight for the Future"></li>
        <li><img src="/images/logos/centerformediajustice.png" alt="Center for Media Justice"></li>
        <li><img src="/images/logos/free-press-action-fund.png" alt="Free Press Action Fund"></li>
        <li><img src="/images/logos/demandprogress.png" alt="Demand Progress"></li>
        <li><img src="/images/logos/github.png" alt="GitHub"></li>
        <li><img src="/images/logos/Etsy_logo-correct.png" alt="Etsy"></li>
        <li><img src="/images/logos/kickstarter-logo-light.png" alt="Kickstarter"></li>
        <li><img src="/images/logos/netflix.jpg" alt="Netflix"></li>
        <li><img src="/images/logos/twitter.png" alt="Twitter"></li>
        <li><img src="/images/logos/vimeo.png" alt="Vimeo"></li>
        <li><img src="/images/logos/boingboing.png" alt="BoingBoing"></li>
        <li><img src="/images/logos/privateinternetaccess.png" alt="Private Internet Access"></li>
        <li><img src="/images/logos/reddit.png" alt="Reddit"></li>
        <li><img src="/images/logos/sonos.png" alt="Sonos"></li>
        <li><img src="/images/logos/mozilla.png" alt="Mozilla"></li>
        <li><img src="/images/logos/EFF-logo-stack-RGB.png" alt="EFF"></li>
        <li><img src="/images/logos/okcupid.png" alt="OkCupid"></li>
        <li><img src="/images/logos/18mr.png" alt="18 Million Rising"></li>
        <li><img src="/images/logos/ycombinator.png" alt="Y Combinator"></li>
        <li><img src="/images/logos/aall.png" alt="AALL"></li>
        <li><img src="/images/logos/accessnow.png" alt="accessnow"></li>
        <li><img src="/images/logos/aclu.jpg" alt="ACLU"></li>
        <li><img src="/images/logos/discord.png" alt="Discord"></li>
        <li><img src="/images/logos/automattic.png" alt="Automattic"></li>
      </ul>
      <p class="text-center"><a href="/july12/#participants">View all</a></p>
    </section>

    <section id="team-cable">
      <h2>They are Team Cable. They want to end net neutrality, to control &amp; tax the Internet.</h2>
      <ul class="logo-cloud">
        <li><img src="~/assets/images/problem-comcast.png" alt="Comcast"></li>
        <li><img src="~/assets/images/problem-verizon.png" alt="Verizon"></li>
        <li><img src="~/assets/images/problem-att.png" alt="ATT"></li>
        <li><img src="~/assets/images/problem-spectrum.png" alt="Spectrum"></li>
      </ul>
      <p>Cable companies are famous for high prices and poor service. Several rank as the most hated companies in America. Now, they're lobbying the FCC and Congress to end net neutrality. Why? It's simple: <strong>if they win the power to slow sites down, they can bully any site into paying millions to escape the "slow lane."</strong> This would amount to a tax on every sector of the American economy. Every site would cost more, since they'd all have to pay big cable. Worse, it would extinguish the startups and independent voices who can't afford to pay. If we lose net neutrality, the Internet will never be the same.</p>
    </section>

    <section id="visit">
      <h2>Want to go above and beyond? Visit your member of Congress.</h2>
      <p>Meeting in person with your member of Congress is by far the most high-impact thing most people can do right now. Ever since the July 12 Day of Action, we've been helping set up Team Internet meetings with members of Congress. <a href="https://events.battleforthenet.com/" target="_blank">Click here to find a Team Internet drop-in visit, scheduled meeting, or town hall near you.</a> If you're a local business owner who could be harmed by a loss of net neutrality rules, that's even more persuasive. <a href="https://www.businessesfornetneutrality.com" target="_blank">Be in touch</a>.</p>
    </section>

    <section id="ooni">
      <h2>Want to use your Internet connection to help catch net neutrality violations? Get this app.</h2>

      <p>ISPs like <a href="https://www.engadget.com/2017/08/22/verizon-video-throttling-net-neutrality-unfair-to-customers/">Verizon</a> and <a href="https://www.polygon.com/2017/2/9/14548880/time-warner-lawsuit-new-york-league-of-legends-netflix">Spectrum</a> already violate net neutrality rules, but it's hard to spot. <a href="https://ooni.torproject.org/">OONI</a>, part of the <a href="https://torproject.org/">Tor Project</a>, helps catch net neutrality violations and other kinds of online censorship. Can you install the app on your phone, and set it to run daily? Visit <a href="http://www.testyourinter.net/">TestYourInter.net</a> to learn more, or download the app now!</p>

      <p>
        <a href="https://itunes.apple.com/us/app/id1199566366"><img class="app-store" src="/images/app-store.png" alt="Download for iOS"></a>
        &nbsp;
        <a href="https://play.google.com/store/apps/details?id=org.openobservatory.ooniprobe"><img class="app-store" src="/images/google-play.png" alt="Download for Android"></a>
      </p>
    </section>

    <section id="videos">
      <h2>What is net neutrality? Why does it matter? Watch these videos!</h2>
      <p><strong>Net neutrality</strong> is the principle that Internet providers like Comcast &amp; Verizon should not control what we see and do online. In 2015, startups, Internet freedom groups, and 3.7 million commenters won strong net neutrality rules from the US Federal Communication Commission (FCC). The rules prohibit Internet providers from blocking, throttling, and paid prioritization&mdash;"fast lanes" for sites that pay, and slow lanes for everyone else. Want to learn more? Watch these videos!</p>
      <video-roll></video-roll>
    </section>

    <section id="extra-reading">
      <h2>Extra Reading</h2>
      <p>Here are some excellent articles for additional depth. They cover the issue, its political history, the struggles we've overcome, and the fight ahead in Congress and at the FCC.</p>
      <ul class="extra-reading">
        <li>
          <a href="http://www.wired.com/2015/11/comcast-may-have-found-a-major-net-neutrality-loophole/" target="_blank">Comcast May Have Found a Major Net Neutrality Loophole</a>
          <em> &mdash; Wired</em>
        </li>
        <li>
          <a href="http://arstechnica.com/business/2016/02/verizons-mobile-video-wont-count-against-data-caps-but-netflix-will/" target="_blank">Verizon's mobile video won't count against data caps&mdash;but Netflix does</a>
          <em> &mdash; Ars Technica</em>
        </li>
        <li>
          <a href="https://www.battleforthenet.com/how-we-won" target="_blank">How we won (the first time around, in 2014)</a>
          <em> &mdash; Battle for the Net</em>
        </li>
        <li>
          <a href="https://medium.com/@freepress/the-fcc-s-net-neutrality-order-protects-internet-freedom-by-restoring-the-law-9092f9f5a99f/" target="_blank">The FCC's Net Neutrality Order Protects Internet Freedom by Restoring the Law</a>
          <em> &mdash; Medium</em>
        </li>
      </ul>
    </section>

    <section id="email-notice">
      <h2>Important notice RE: Delivery of emails to Congress</h2>
      <p>When you submit to Battle for the Net, you aren't just signing a petition. We actually deliver your messages directly to Congress. However, we submit them through a rate-limited API and this can cause delays. For example, after the July 12th day of action an unprecedented number of submissions created significant delays. We've since taken steps to speed up submission, but it led to some confusion when users received replies from Congress long after taking action. Also, members of Congress themselves sometimes take weeks or more to reply to constituents. So please keep in mind that there may be a delay between when you take action and when your members of Congress reply.</p>
    </section>

    <social-sidebar />
    <persistent-button><a class="btn" href="#bftn-action-form">Write Congress</a></persistent-button>

  </div>
</template>

<script>
import { createMetaTags } from '~/assets/js/helpers'
import LoaderLogo from '~/components/LoaderLogo'
import CallForm from '~/components/CallForm'
import PetitionForm from '~/components/PetitionForm'
import Scoreboard from '~/components/Scoreboard/Scoreboard'
import VideoRoll from '~/components/VideoRoll'
import SocialSidebar from '~/components/SocialSidebar'
import PersistentButton from '~/components/PersistentButton'
import BattleStats from '~/components/BattleStats'

export default {
  components: {
    LoaderLogo,
    CallForm,
    PetitionForm,
    Scoreboard,
    VideoRoll,
    SocialSidebar,
    PersistentButton,
    BattleStats
  },

  computed: {
    isCallPage() {
      return this.$route.name === 'call' || this.$route.query.call
    }
  }
}
</script>
