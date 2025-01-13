## dbdiagram.io code

1. Below is the code that will generate the database schema on dbdiagram.io:

Table entries {
id int [pk, increment]
user_id int
title varchar [not null]
body text
sentiment varchar
weather varchar
moon_phase varchar
created_at datetime [default: `now()`]
}

Table tags {
id int [pk, increment]
name varchar [not null]
color varchar
is_default boolean [default: false]
}

Table entry_tags {
entry_id int [ref: > entries.id]
tag_id int [ref: > tags.id]

Indexes {
(entry_id, tag_id) [pk]
}
}

Enum goals_status {
in_progress
completed
on_hold
cancelled
}

Table goals {
id int [pk, increment]
user_id int
title varchar [not null]
description text
status goals_status
created_at datetime [default: `now()`]
}

Table entry_goals {
entry_id int [ref: > entries.id]
goal_id int [ref: > goals.id]

Indexes {
(entry_id, goal_id) [pk]
}
}

Table milestones {
id int [pk, increment]
user_id int
milestone_name varchar [not null]
is_completed boolean [default: false]
goal_id int
created_at datetime [default: `now()`]
}

Ref: milestones.goal_id > goals.id
