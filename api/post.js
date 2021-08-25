export const getPosts = async ({tags = '', page = 1, include_tags = 1, limit = 50}) => {
  var t = `-production_materials -presumed -artist_unknown order:random`;
  if (tags) {
    t = `${tags} -production_materials -presumed -artist_unknown order:random`;
  }
  const url = `https://www.sakugabooru.com/post.json?tags=${t}&filter=1&api_version=2&include_tags=${include_tags}&limit=${limit}`;
  const response = await fetch(url);
  return response.json();
};

export const formatPostForGame = async options => {
  var posts = await getPostWithOptions(options);
  if (posts.length === 0) posts = await getPostWithOptions(options);
  return posts;
};

export const getPostWithOptions = async options => {
  var postsWithOptions = [];
  try {
    const data = await getPosts(options);
    for (const post of data.posts) {
      if (post) {
        const postWithOptions = await getOptions(data.tags, post);
        if (postWithOptions.artists.length === 1) {
          const ext = postWithOptions.file_ext;
          if (ext === 'mp4' || ext === 'webm' || ext === 'gif') postsWithOptions.push(postWithOptions);
        }
      }
    }
  } catch (error) {
    console.log('FORMAT_ERROR: ', error);
  }
  return postsWithOptions;
};

export const getOptions = async (allTags, post) => {
  var artists = [];
  var artistForOptions = [];
  var options = [];
  var tags = [];
  try {
    for (const tag in allTags) {
      if (Object.hasOwnProperty.call(allTags, tag)) {
        const type = allTags[tag];
        if (post.tags.includes(tag) && type === 'artist') {
          const artist = tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          artists.push(artist);
        }
        if (!post.tags.includes(tag) && type === 'artist') {
          if (!artistForOptions.includes(tag)) artistForOptions.push(tag);
        }
        if (post.tags.includes(tag)) {
          tags.push({type, name: tag});
        }
      }
    }

    for (let index = 0; index < 3; index++) {
      const index = Math.floor(Math.random() * artistForOptions.length);
      const o = artistForOptions[index];
      options.push(o.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      artistForOptions.splice(index, 1);
    }

    options.push(artists[0]);

    const shuffledOptions = shuffleArray(options);

    if (post && artists.length > 0 && options.length > 3) {
      post.artists = artists;
      post.options = shuffledOptions;
      post.tags = tags;
      return post;
    }
  } catch (error) {
    console.log('OPTIONS_ERROR: ', error);
  }

  return {artists: []};
};

export const shuffleArray = array => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
