import 'server-only';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { NextResponse } from 'next/server';
import { ServerError } from '@/errors/server-error';

export async function PUT() {
  try {
    const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
    const userRepo = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);
    const user = await auth.loadSessionUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const updatedUser = await userRepo.awardElectionRemindersBadge(user.uid);
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (e) {
    console.error(e);

    if (e instanceof ServerError) {
      return NextResponse.json(
        { message: e.message },
        { status: e.statusCode },
      );
    }

    return NextResponse.json(
      { message: 'An unknown error occurred.' },
      { status: 500 },
    );
  }
}
