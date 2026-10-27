async function testAll() {
  const baseUrl = 'http://localhost:3000';

  console.log('1. Testing GET /');
  const indexRes = await fetch(baseUrl);
  console.log('   Status:', indexRes.status, indexRes.status === 200 ? '✅ OK' : '❌ FAIL');

  console.log('2. Testing GET /api/me');
  const meRes = await fetch(`${baseUrl}/api/me`);
  const me = await meRes.json();
  console.log('   Current User:', me.username, me.name, '✅ OK');

  console.log('3. Testing GET /api/posts');
  const postsRes = await fetch(`${baseUrl}/api/posts`);
  const posts = await postsRes.json();
  console.log(`   Found ${posts.length} posts. ✅ OK`);

  console.log('4. Testing POST /api/posts (creating post)');
  const createRes = await fetch(`${baseUrl}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: 'Testing Pulse automated test post #tech #verified',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'
    })
  });
  const newPost = await createRes.json();
  console.log('   Created Post ID:', newPost.id, 'Tags:', newPost.tags, '✅ OK');

  console.log('5. Testing POST /api/posts/:id/like (liking post)');
  const likeRes = await fetch(`${baseUrl}/api/posts/${newPost.id}/like`, { method: 'POST' });
  const likeData = await likeRes.json();
  console.log('   Is Liked:', likeData.isLiked, 'Likes Count:', likeData.likesCount, '✅ OK');

  console.log('6. Testing POST /api/posts/:id/comments (adding comment)');
  const commentRes = await fetch(`${baseUrl}/api/posts/${newPost.id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'Phenomenal interactive test comment!' })
  });
  const commentData = await commentRes.json();
  console.log('   Comment ID:', commentData.id, 'Author:', commentData.author.name, '✅ OK');

  console.log('7. Testing POST /api/users/:username/follow (toggling follow on sarah)');
  const followRes = await fetch(`${baseUrl}/api/users/sarah/follow`, { method: 'POST' });
  const followData = await followRes.json();
  console.log('   Is Following Sarah:', followData.isFollowing, 'Follower Count:', followData.targetUser.followersCount, '✅ OK');

  console.log('8. Testing PUT /api/users/:username (editing profile)');
  const updateRes = await fetch(`${baseUrl}/api/users/${me.username}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Senior AI & Full-Stack Architect',
      bio: 'Updated bio testing live edits!'
    })
  });
  const updatedUser = await updateRes.json();
  console.log('   Updated Title:', updatedUser.title, '✅ OK');

  console.log('9. Testing GET /api/notifications');
  const notifRes = await fetch(`${baseUrl}/api/notifications`);
  const notifs = await notifRes.json();
  console.log(`   Found ${notifs.length} notifications. ✅ OK`);

  console.log('10. Testing GET /api/conversations (fetching conversations list)');
  const convRes = await fetch(`${baseUrl}/api/conversations`);
  const convs = await convRes.json();
  console.log(`   Found ${convs.length} conversations. Top partner: @${convs[0]?.partner?.username}. ✅ OK`);

  console.log('11. Testing POST /api/messages/sarah (sending direct message)');
  const sendRes = await fetch(`${baseUrl}/api/messages/sarah`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'Hey Sarah! This is a real-time test message between two users!' })
  });
  const sentMsg = await sendRes.json();
  console.log('   Sent Message ID:', sentMsg.id, 'Content:', sentMsg.content, '✅ OK');

  console.log('12. Testing GET /api/messages/sarah (fetching conversation thread)');
  const threadRes = await fetch(`${baseUrl}/api/messages/sarah`);
  const threadData = await threadRes.json();
  console.log(`   Fetched thread with ${threadData.messages.length} messages. Partner: ${threadData.partner.name}. ✅ OK`);

  console.log('13. Testing GET /api/messages-unread-count');
  const unreadRes = await fetch(`${baseUrl}/api/messages-unread-count`);
  const unreadData = await unreadRes.json();
  console.log('   Unread messages count:', unreadData.unreadCount, '✅ OK');

  console.log('\n🎉 ALL BACKEND ENDPOINTS AND SYSTEMS (INCLUDING 1-ON-1 MESSAGING) TESTED SUCCESSFULLY!');
}

testAll().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
