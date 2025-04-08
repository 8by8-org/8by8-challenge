import Image from 'next/image';
import Link from 'next/link';
import { PageContainer } from '@/components/utils/page-container';
import tealCurve from '../../../public/static/images/pages/home/teal-curve.svg';
import tealBottom from '../../../public/static/images/pages/why-8by8/shapes/teal-curve-1.png';
import voteBubble from '../../../public/static/images/pages/why-8by8/graphics/speech-bubble.svg';
import arnab from '../../../public/static/images/pages/why-8by8/portraits/arnab.png';
import luis from '../../../public/static/images/pages/why-8by8/portraits/luis.png';
import yudy from '../../../public/static/images/pages/why-8by8/portraits/yudy.png';
import agustina from '../../../public/static/images/pages/why-8by8/portraits/agustina.png';
import blurDivider from '../../../public/static/images/pages/why-8by8/shapes/yellow-blur-2.png';
import pieChart from '../../../public/static/images/pages/why-8by8/graphics/pie-chart.png';
import blurBlob from '../../../public/static/images/pages/why-8by8/shapes/yellow-blur-1.png';
import tealTop from '../../../public/static/images/pages/why-8by8/shapes/teal-curve-2.png';
import tealWave from '../../../public/static/images/pages/why-8by8/shapes/teal-curve-3.png';
import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';
import styles from './styles.module.scss';

/* istanbul ignore next */
export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Why 8by8`,
};

export default function Why8by8() {
  return (
    <PageContainer>
      <div className={styles.why_8by8}>
        <div className={styles.why_hero}>
          <div className={styles.padding}>
            <h1 className={styles.underline}>Why 8by8</h1>
            <q>
              AAPI hate crimes have shot through the roof during the pandemic,
              yet there&apos;s limited media coverage. 8by8 gives me the
              opportunity to use my skills to advance political and social
              equality for the AAPI community and help increase voter turnout.
              The AAPI community deserves a future where we&apos;re treated the
              same and our culture is respected.
            </q>
            <aside>
              <span>—Arnab, High School Student</span>
              <Image src={arnab} alt="Arnab"></Image>
            </aside>
          </div>

          <div className={styles.custom_shape_divider_top}>
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className={styles.shape_fill}
              ></path>
            </svg>
          </div>
        </div>
        <div className={styles.teal_stats}>
          <h1 className={styles.bold_shadow}>20%</h1>
          <h3>
            of Asian Americans and Pacific Islanders have experienced a hate
            incident in 2021.
          </h3>
        </div>
        <div className={styles.white_midsection}>
          <Image
            src={tealCurve}
            className={styles.teal_curve}
            alt="Teal Curve"
          ></Image>
          <q>
            It is was heart-breaking to know that the AAPI community, including
            my Indonesian friends, is still subjected to racism and
            discrimination. I was greatly encouraged to join 8by8 to contribute
            to the AAPI community and call out issues with the government and
            our society. I hope to do this not only in the US, but also
            everywhere across the world!
          </q>
          <aside>
            <span>—Agustina, College Student</span>
            <Image src={agustina} alt="Agustina"></Image>
          </aside>
          <Image
            src={blurDivider}
            className={styles.blur_divider}
            alt="Blur Divider"
          ></Image>
          <h1> Types of Hate Crimes Against AAPI</h1>
          <div className={styles.chart}>
            <Image src={pieChart} alt="Pie Chart" />
          </div>
          <h3>
            <b>11% of these are considered civil rights violations</b>, where
            the AAPI community members were barred from transportation, faced
            discrimination from housing or in the workplace, etc.
            <Image src={blurBlob} alt="Blur Blob" />
          </h3>
          <div className={styles.last_stat}>
            <h3>
              AAPI Hate Incidents reported by <br />
              <u>women</u> make up
              <br />
              <span className={styles.bold_shadow}> 62% </span>
              <br />
              Of All Reports
            </h3>
            <Image
              src={blurBlob}
              className={styles.blur_blob}
              alt="Blur Blob"
            />
          </div>
        </div>
        <div className={styles.final_teal_stats}>
          <Image className={styles.top_curve} src={tealTop} alt="Teal Top" />
          <h2>Asians Have Historically Low Election Turnout</h2>
          <h1 className={styles.bold_shadow}>Below 60%</h1>
          <div className={styles.stat}>
            <h3>
              Asian-Americans Make Up
              <br />
              <span className={styles.bold_shadow}>7%</span>
              <br />
              Of the Population
            </h3>
          </div>
          <div className={styles.stat}>
            <h3>
              But Only
              <br />
              <span className={styles.bold_shadow}>3%</span>
              <br />
              Of Congress is Asian or AAPI
            </h3>
          </div>
          <Image
            src={tealWave}
            className={styles.left_spread}
            style={{ transform: 'translateY(00%)' }}
            alt="Teal Wave"
          />
        </div>
        <div className={styles.closing_quotes}>
          <q>
            The protagonists of my favorite Asian anime shows (DBZ, My Hero
            Academia, and Naruto) have taught me to always help those in danger.
            After hearing about the hate crimes from the news and from my AAPI
            peers, I wanted to help but didn&apos;t know how. Luckily I found
            8by8, and I resonated with their goal to protect AAPI rights through
            voter registration.
          </q>
          <aside>
            <span>—Luis, College Student</span>
            <Image className={styles.img_1} src={luis} alt="Luis"></Image>
          </aside>
          <div className={styles.quote_gap}></div>
          <q>
            I joined the 8by8 partnerships team hoping to leverage my network
            and make a difference to the future of AAPI in America. Voter
            registration is a great starting point. My dream is to build a chain
            of modern and inclusive community centers for Asian Americans. With
            more civic engagement and political presence, the journey for modern
            Asian Community Centers can be easier and smoother!
          </q>
          <aside style={{ position: 'relative', zIndex: 2 }}>
            <span className={styles.quote_gap_2}>
              —Yudy, Partnership Lead at 8BY8
            </span>
            <Image src={yudy} alt="Yudy"></Image>
          </aside>

          <div className={styles.chefus_quote}>
            <Image
              src={tealBottom}
              className={styles.teal_bottom}
              alt="Teal Bottom"
            />
            <q>
              Folks at 8by8 are professional and dedicated to fight for Asian
              rights. Thank you so much for your hard work and keep thriving!
            </q>
            <aside>
              <span>—Xintao She, Chefus CEO</span>
              <div className={styles.logo}></div>
            </aside>
            <Image src={tealTop} className={styles.teal_top} alt="Teal Top" />
          </div>
        </div>
        <div className={styles.pseudo_footer}>
          <h4>Did you know?</h4>
          <h3>
            A swing of just
            <span className={styles.bold_shadow}>
              21,459 <br /> Votes
            </span>
            Would have <u>reversed</u> the outcome <br /> of the 2020
            Presidential
            <br />
            election.
          </h3>
          <h4 style={{ padding: '2em 0' }}>
            That&apos;s a very small portion of AAPI voters who already make up
            4% of the overall electorate! Your vote really counts!
          </h4>
          <Image
            className={styles.vote_bubble}
            src={voteBubble}
            alt="Vote Bubble"
          />
        </div>
        <div className={styles.links_box}>
          <Link href="https://www.instagram.com/8by8vote/" target={'blank'}>
            Follow 8by8 Instagram to learn more
          </Link>
          <br />
          <br />
          <span>
            Source:&nbsp;
            <Link href="https://stopaapihate.org/national-report-through-september-2021/">
              Stop AAPI Hate Report (2020-2021)
            </Link>
          </span>
        </div>
      </div>
    </PageContainer>
  );
}
