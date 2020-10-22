import createHandler from "lib/routeHandler";
import multer from "multer";
import { promises as fs } from "fs";
import { Request } from "models";
import { authMiddleware } from "lib/middleware";

const handler = createHandler().use(authMiddleware);
const upload = multer({ dest: "tmp/" });

handler.post(upload.single("evidence"), async (req, res) => {
  const { id } = req.query;
  const request = await Request.findById(id);

  //setting evidence on Request
  request.evidence = await fs.readFile(req.file.path);
  request.isClaimed = true;

  //Clean up tmp file
  await fs.unlink(req.file.path);

  await request.save();

  res.status(204).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
