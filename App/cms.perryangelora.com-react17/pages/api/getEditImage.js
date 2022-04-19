export default async function handler(req, res) {
  const response = await fetch(req.body.url)
    .then((data) => data.buffer())
    .then((buffer) => {
      const base64 = buffer.toString('base64');
      return base64;
    })
    .catch((err)=> console.warn(err));
  res.status(200).send(response);
}
