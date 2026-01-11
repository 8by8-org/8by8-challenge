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

create index idx_reward_snapshots_partner on reward_snapshots(partner_id);

create table claimed_rewards (
    id serial primary key,
    user_id uuid not null references public.users(id) on delete cascade,
    reward_id uuid not null,
    reward_updated_at timestamptz not null,
    claimed_at timestamptz not null,
    foreign key (reward_id, reward_updated_at) references reward_snapshots(id, updated_at) on delete restrict
);

create index idx_claimed_rewards_user_id on claimed_rewards(user_id);
create index idx_claimed_rewards_reward on claimed_rewards(reward_id, reward_updated_at);

alter table claimed_rewards enable row level security;

create policy "Users can view their claimed rewards"
    on claimed_rewards
    for select
    using (user_id = auth.uid());

create policy "Users can insert their claimed rewards"
    on claimed_rewards
    for insert
    with check (user_id = auth.uid());

create policy "Users can update their claimed rewards"
    on claimed_rewards
    for update
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy "Users can delete their claimed rewards"
    on claimed_rewards
    for delete
    using (user_id = auth.uid());

create table vouchers (
    id serial primary key,
    claimed_reward_id integer not null references claimed_rewards(id) on delete cascade,
    redemption_method redemption_method not null,
    instructions text not null,
    value varchar(255),
    href varchar(255),
    link_text varchar(255),
    redeemed boolean default false
);

create index idx_vouchers_claimed_reward_id on vouchers(claimed_reward_id);

alter table vouchers enable row level security;

create policy "Users can view their vouchers"
    on vouchers
    for select
    using (claimed_reward_id in (select id from claimed_rewards where user_id = auth.uid()));

create policy "Users can insert their vouchers"
    on vouchers
    for insert
    with check (claimed_reward_id in (select id from claimed_rewards where user_id = auth.uid()));

create policy "Users can update their vouchers"
    on vouchers
    for update
    using (claimed_reward_id in (select id from claimed_rewards where user_id = auth.uid()))
    with check (claimed_reward_id in (select id from claimed_rewards where user_id = auth.uid()));

create policy "Users can delete their vouchers"
    on vouchers
    for delete
    using (claimed_reward_id in (select id from claimed_rewards where user_id = auth.uid()));

