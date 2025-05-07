import { generateMetadata } from '@/app/challengerwelcome/page';
import { SearchParams } from '@/constants/search-params';

describe('generateMetadata', () => {
  it('returns a special image if the user has won the challenge.', () => {
    const metadata = generateMetadata({
      searchParams: {
        [SearchParams.WonTheChallenge]: 'true',
      },
    });

    expect(metadata).toEqual({
      openGraph: {
        images: {
          url: '/static/images/open-graph/won-challenge.png',
          height: 4320,
          width: 4320,
        },
      },
      title: expect.any(String),
    });
  });

  it('returns the default thumbnail if the challenger has not won the challenge.', () => {
    const metadata = generateMetadata({
      searchParams: {},
    });

    expect(metadata).toEqual({
      openGraph: {
        images: {
          url: '/static/images/open-graph/thumbnail.png',
          height: 1337,
          width: 1337,
        },
      },
      title: expect.any(String),
    });
  });
});
