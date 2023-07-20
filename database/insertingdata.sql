use social
select *from users

INSERT INTO users ( firstname, lastname, username, email,password, imageurl, datecreated)
VALUES
  ('Janet' ,'Stephen', 'janet_22', 'amber@logan.tv', 'pwd123','/assets/person/person1.jpg', GETDATE()),
  ('Isabella',' Randy', 'isabel_23', 'isabella@randy.biz','pwd123', '/assets/person/person2.jpg', GETDATE()),
  ('Beverly',' Bruce', 'beverly_24', 'Sherwood@rosamond.me', 'pwd123','/assets/person/person3.jpg', GETDATE()),
  ('Glenna',' Philip', 'glenna_25', 'Chaim_McDermott@dana.io','pwd123', '/assets/person/person4.jpg', GETDATE());

INSERT INTO posts ( userid, content, datecreated, contentimageurl, contentvideourl,mediatype)
VALUES
  ( 3, 'to make a blinded choice to reject or provident to task', GETDATE(), '/assets/posts/post1.jpg', NULL,'text'),
  ( 2, 'who is to be', GETDATE(), '/assets/posts/post2.jpg', NULL,'text'),
  ( 1, 'abuse her as an exercise in who she or she is', GETDATE(), '/assets/posts/post3.jpg', NULL,'text');
  -- Add more entries as needed


INSERT INTO comments ( postid, userid, content, datecreated, contentimageurl, contentvideourl,mediatype)
VALUES
  ( 1, 3, 'This is a comment', GETDATE(), '/assets/comments/comment1.jpg', NULL,'text'),
  ( 2, 2, 'Another comment', GETDATE(), '/assets/comments/comment2.jpg', NULL,'text'),
  ( 3, 1, 'Yet another comment', GETDATE(), '/assets/comments/comment3.jpg', NULL,'text');
  -- Add more entries as needed


INSERT INTO likes ( postid, countlikes, userid, datecreated)
VALUES
  (1, 100, 3, GETDATE()),
  ( 2, 480, 2, GETDATE()),
  ( 3, 10, 1, GETDATE());
  -- Add more entries as needed

INSERT INTO followers ( userid, followeruserid, datecreated)
VALUES
  (1, 3, GETDATE()),
  (2, 4, GETDATE()),
  (3, 1, GETDATE());
  -- Add more entries as needed

EXEC InsertReply @commentid = 1, @userid = 1, @replytext = 'This is a reply', @replydate = GETDATE();
-- Execute the stored procedure for each reply entry

DELETE FROM users;
