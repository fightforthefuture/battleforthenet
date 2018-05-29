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
      <h1 class="text-center">Net neutrality is freedom on the Internet</h1>
      <call-form v-if="isCallPage" page="call"></call-form>
      <petition-form v-else />
    </section>

    <section id="join">
      <h2>Put the Internet on Red Alert for June 11th</h2>
      <p>The FCC’s repeal of net neutrality will officially take place on <a href="https://www.reuters.com/article/us-usa-internet/u-s-net-neutrality-rules-will-end-on-june-11-fcc-idUSKBN1IB1UN" target="_blank">June 11th</a>.  Don’t worry… the internet won’t suddenly stop working on that day.  But if we don’t convince Congress to protect net neutrality with strong laws, your cable companies will slowly begin throttling traffic, imposing new unfair fees and threatening free speech and free markets on the Internet.</p>
      <p>That’s where you come in.  If you run a website, you can place our Red Alert widget on your website.  The widget is a small — but powerful — way to raise awareness and rally the public to contact Congress in support of net neutrality.  Check it out:</p>
      <div class="modals flex-center">
        <img src="/images/redalert/modal-minimized-preview@2x.jpg"
          alt="A screenshot of our Red Alert modal when minimized"
          class="rounded">
      </div>
      <p>Users who click the TAKE ACTION button will be able to send a letter to Congress from within the widget by entering their contact info.  Users who the CLOSE button won’t see the widget on your site for 24 hours. Try it out for yourself <a href="https://www.fightforthefuture.org?redalert" target="_blank">here</a>.</p>
      <p>It’s easy to use. Simply add the line of code below to your website’s header. And don’t forget to <a href="https://github.com/fightforthefuture/redalert-widget">visit our GitHub page</a> to learn how to customize the widget for your site.</p>
      <code>&lt;script src="https://redalert.battleforthenet.com/widget.js" async&gt;&lt;/script&gt;</code>
    </section>

    <section id="social-media">
      <h2>Spread the word online</h2>
      <p>We have a variety of banner ads that you can display on your website to show your support for net neutrality.  And if you don’t run a website, you can still help spread the word on social media by updating your Facebook profile, Twitter account or Instagram story.  Click <a href="https://drive.google.com/drive/folders/1pseCi3ZSuYBIkCgLpthrPF2ss5RSCtCM" target="_blank">here</a> to view all of the great content we’ve made.</p>
      <p class="text-center">
        <a href="https://drive.google.com/drive/folders/1pseCi3ZSuYBIkCgLpthrPF2ss5RSCtCM" target="_blank"><img src="/images/redalert/instagram-story.jpg" srcset="/images/redalert/instagram-story.jpg 1x, /images/redalert/instagram-story@2x.jpg 2x" alt="Instagram story screenshot"></a>
      </p>
      <p class="text-center">
        <a class="btn" href="https://drive.google.com/drive/folders/1pseCi3ZSuYBIkCgLpthrPF2ss5RSCtCM" target="_blank">View all</a>
      </p>
    </section>

    <section id="stats">
      <h2>We are making Congress listen</h2>
      <p>Voters from across the political spectrum agree: they don't want their cable company to control what they see and do online. The FCC's reckless repeal of net neutrality has sparked an unprecedented backlash, as millions of Americans have contacted their lawmakers in protest.  The numbers below represent actions taken through BattleForTheNet.com and its partners. Many more have taken action on other sites or contacted their lawmakers directly. </p>
      <p>To help convince the House, <a href="#bftn-action-form">contact congress now</a> and add to these numbers.</p>
      <battle-stats></battle-stats>
    </section>

    <section id="scoreboard">
      <h2>View the Congressional Scoreboard</h2>
      <p>We’re keeping track of who supports net neutrality … and who doesn’t.  Now you can, too.  Below you'll find a list of your state's Senators and Representatives. The ones in green support net neutrality, so let them know you appreciate their support. The ones in red need to be convinced, so let them know how important this issue is to you. </p>
      <p>We already won in the Senate. Now we must win the House. So please tweet and call your <a href="/scoreboard/#house">House Representatives</a>.</p>
      <scoreboard :summary="true"></scoreboard>
    </section>

    <section id="events">
      <h2>Attend an event in your area</h2>
      <p>Want to make your voice heard? Check out the map below to find a protest or a meeting with a representative in your state. And if there are no events in your area, consider organizing one!</p>
      <iframe class="events-map" src="https://events.battleforthenet.com/iframe"></iframe>
    </section>

    <section id="net-neutrality">
      <h2>What is net neutrality? Why does it matter?</h2>
      <p>Net neutrality is the principle that everyone should have access to websites and apps, preventing Internet providers like Comcast & Verizon from creating “<a href="https://arstechnica.com/information-technology/2016/02/verizons-mobile-video-wont-count-against-data-caps-but-netflix-will/" target="_blank">fast lanes</a>,” <a href="http://netneutrality.koumbit.org/en/node/5" target="_blank">censoring content</a>, <a href="https://www.extremetech.com/computing/186576-verizon-caught-throttling-netflix-traffic-even-after-its-pays-for-more-bandwidth" target="_blank">throttling traffic</a> and even outright <a href="http://www.washingtonpost.com/blogs/post-tech/post/fcc-fines-verizon-125m-for-blocking-tethering-apps/2012/07/31/gJQAXjRLNX_blog.html" target="_blank">blocking access</a> to their competitor's products. This principle has guided the world wide web from the beginning, and has been protected by federal policy under Republican AND Democrat leadership since the <a href="https://apps.fcc.gov/edocs_public/attachmatch/FCC-05-151A1.pdf" target="_blank">early 2000s</a>.</p>
      <p>Unfortunately, Internet providers ignored this policy and even actively <a href="https://en.wikipedia.org/wiki/Verizon_Communications_Inc._v._FCC_(2014)" target="_blank">sued the federal government</a> to destroy net neutrality protections… and they won. Their anti-consumer practices finally convinced the FCC to issue the Open Internet Order as a last resort in 2015. But under new leadership, the FCC has removed these regulations, threatening to end the web as we know it.</p>
      <p>Want to learn more? Watch these videos!</p>
      <video-roll></video-roll>
    </section>

    <section id="team-internet">
      <h2>We are Team Internet</h2>
      <p>Members of Team Internet support free speech and free markets online through meaningful, enforceable net neutrality laws. We are millions of everyday Americans from <a href="http://thehill.com/policy/technology/364528-poll-83-percent-of-voters-support-keeping-fccs-net-neutrality-rules" target="_blank">across the political spectrum</a>. We are <a href="https://www.businessesfornetneutrality.com/" target="_blank">thousands of small business owners</a>.  We are <a href="https://twitter.com/netflix/status/941373853216915456" target="_blank">large corporations</a> and <a href="https://www.aclu.org/issues/free-speech/internet-speech/net-neutrality" target="_blank">powerful non-profits</a>. Check out the list below to see who’s taken action to save net neutrality:</p>
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
      <h2>They are Team Cable</h2>
      <p>Team Cable wants to end net neutrality so they can control and tax the Internet. Team Cable <a href="https://www.wired.com/story/the-fcc-says-net-neutrality-cripples-investment-thats-not-true/" target="_blank">lies about the effects of net neutrality</a> on the free market and <a href="https://gizmodo.com/senators-demand-fcc-answer-for-fake-comments-after-real-1826213294" target="_blank">ignores blatant corruption</a> in the regulatory process. If they get their way, we will all pay more money for worse Internet access. Independent voices <a href="https://www.donttreadonthe.net/" target="_blank">will be stifled</a>. And innovative start-ups will struggle to compete in the online marketplace.</p>
      <ul class="logo-cloud">
        <li><img src="~/assets/images/problem-comcast.png" alt="Comcast"></li>
        <li><img src="~/assets/images/problem-verizon.png" alt="Verizon"></li>
        <li><img src="~/assets/images/problem-att.png" alt="ATT"></li>
        <li><img src="~/assets/images/problem-spectrum.png" alt="Spectrum"></li>
      </ul>
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
