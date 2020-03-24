import File from '../models/File';
import Deliveryman from '../models/Deliveryman';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { id } = req.params;

    if (id) {
      const deliveryMan = await Deliveryman.findByPk(id);

      if (!deliveryMan) {
        return res.status(400).json({ error: 'This user is not a delivery.' });
      }
    }

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
