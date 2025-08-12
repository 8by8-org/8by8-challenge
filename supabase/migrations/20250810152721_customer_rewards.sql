create type redemption_forum as enum ('online', 'in-store');
create type redemption_method as enum ('code','qr-code', 'link', 'manual'); 

create table partner_snapshot (
    id varchar(255) primary key,
    name varchar(255) not null,
    logo_url varchar(255) not null,
    description text not null,
    website varchar(255),
    why8by8 text,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create table reward_snapshots (
    id uuid not null,
    updated_at timestamptz not null,
    partner_id varchar(255) not null references partner_snapshot(id) on delete restrict,
    short_description varchar(255) not null,
    redemption_forums redemption_forum[] not null,
    categories varchar[] not null,
    long_description text,
    claimable_until timestamptz,
    redeemable_until timestamptz,
    redeemable_for interval,
    created_at timestamptz not null,
    primary key (id, updated_at)
);

create table claimed_rewards (
    id serial primary key,
    user_id uuid not null references public.users(id) on delete restrict,
    reward_id uuid not null,
    reward_updated_at timestamptz not null,
    claimed_at timestamptz not null,
    foreign key (reward_id, reward_updated_at) references reward_snapshots(id, updated_at) on delete restrict
);

create table vouchers (
    id serial primary key,
    claimed_reward_id integer not null references claimed_rewards(id) on delete restrict,
    redemption_method redemption_method not null,
    instructions text not null,
    value varchar(255),
    href varchar(255),
    link_text varchar(255),
    redeemed boolean default false
);

