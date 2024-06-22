create table User
(
    id         int auto_increment
        primary key,
    username   varchar(50)                           not null,
    password   varchar(50)                           not null,
    email      varchar(50)                           not null,
    created_at timestamp default current_timestamp() not null,
    updated_at timestamp default current_timestamp() not null on update current_timestamp(),
    constraint username
        unique (username)
)
    engine = InnoDB;

create table ChatRoom
(
    id         int auto_increment
        primary key,
    name       varchar(50)                           not null,
    creatorId  int                                   not null,
    created_at timestamp default current_timestamp() not null,
    updated_at timestamp default current_timestamp() not null on update current_timestamp(),
    constraint name
        unique (name),
    constraint ChatRoom_ibfk_1
        foreign key (creatorId) references User (id)
            on delete cascade
)
    engine = InnoDB;

create index creatorId
    on ChatRoom (creatorId);

create table Message
(
    id          int auto_increment
        primary key,
    content     text                                  not null,
    sent_at     timestamp default current_timestamp() not null,
    user_id     int                                   not null,
    chatroom_id int                                   not null,
    constraint Message_ibfk_1
        foreign key (user_id) references User (id)
            on delete cascade,
    constraint Message_ibfk_2
        foreign key (chatroom_id) references ChatRoom (id)
            on delete cascade
)
    engine = InnoDB;

create index chatroom_id
    on Message (chatroom_id);

create index user_id
    on Message (user_id);

