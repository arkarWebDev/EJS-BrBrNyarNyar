const posts = [];

exports.createPost = (req, res) => {
    const { title, description , photo} = req.body;
    console.log(`Title value is ${title} & description is ${description}`);
    posts.push({
        id : Math.random(),
        title,
        description,
        photo
    });
    res.redirect("/");
}

exports.renderCreatePage = (req, res) => {
    // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
    res.render("addPost", { title: "Post create ml" });
}

exports.renderHomePage = (req, res) => {
    console.log(posts);
    // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
    res.render("home", { title: "Hello World", postsArr: posts });
}

exports.getPost = (req,res)=>{
    const postId = Number(req.params.postId);
    console.log(postId);
    const post = posts.find((post)=>post.id === postId)
    console.log(post);
    res.render("details",{title : "Post Details Page",post})
}