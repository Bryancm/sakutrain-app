export const findTag = async ({name = ''}) => {
  const url = `https://www.sakugabooru.com/tag.json?name=${name}`;
  const response = await fetch(url);
  return response.json();
};
