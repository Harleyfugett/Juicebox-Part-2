const {  
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    createTags,
    addTagsToPost,
    getPostsByTagName,
    getAllTags
  } = require('./index');
  
  async function dropTables() {
    try {
      await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
      `);
  
    } catch (error) {
      throw error;
    }
  }
  
  async function createTables() {
    try {
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          name varchar(255) NOT NULL,
          location varchar(255) NOT NULL,
          active boolean DEFAULT true
        );
        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          "authorId" INTEGER REFERENCES users(id),
          title varchar(255) NOT NULL,
          content TEXT NOT NULL,
          active BOOLEAN DEFAULT true
        );
        CREATE TABLE tags(
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL
      );
      CREATE TABLE post_tags(
          "postId" INTEGER REFERENCES posts(id),
          "tagId" INTEGER REFERENCES tags(id),
          UNIQUE("postId", "tagId")
      );
      `);
  
    } catch (error) {
      throw error;
    }
  }
  
  async function createInitialUsers() {
    console.log("Creating initial users")
    try {
  
      await createUser({ 
        username: 'albert', 
        password: 'bertie99',
        name: 'Al Bert',
        location: 'Sidney, Australia' 
      });
      await createUser({ 
        username: 'sandra', 
        password: '2sandy4me',
        name: 'Just Sandra',
        location: 'Ain\'t tellin\''
      });
      await createUser({ 
        username: 'glamgal',
        password: 'soglam',
        name: 'Joshua',
        location: 'Upper East Side'
      });
      console.log("Created initial users")
    } catch (error) {
      throw error;
    }
  }
  
  async function createInitialPosts() {
    // console.log("Creating initial posts")
    try {
      const [albert, sandra, glamgal] = await getAllUsers();
      // console.log("getAllUsers output", albert, sandra, glamgal)
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
        tags: ["#happy", "#youcandoanything"]
      });
  // console.log("Line 101")
      await createPost({
        authorId: sandra.id,
        title: "How does this work?",
        content: "Seriously, does this even do anything?",
        tags: ["#happy", "#worst-day-ever"]
      });
  
      await createPost({
        authorId: glamgal.id,
        title: "Living the Glam Life",
        content: "Do you even? I swear that half of you are posing.",
        tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
      });
      // console.log("Created initial posts")
    } catch (error) {
      throw error;
    }
  }
  
  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialPosts();
    } catch (error) {
      throw error;
    }
  }
  
  async function testDB() {
    try {
      const users = await getAllUsers();
      const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });
      const posts = await getAllPosts();
  
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content"
      });
  
      const albert = await getUserById(1);
  
    } catch (error) {
  
      throw error;
    }
  }
  
  
  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());