import * as Yup from 'yup';
import User from '../models/User';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const isAdmin = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: "You aren't authorized to use this resource" });
    }

    const deliveryman = await Deliveryman.findAll();

    return res
      .status(200)
      .json(
        deliveryman.length > 0
          ? deliveryman
          : 'There are no registered couriers '
      );
  }

  async show(req, res) {
    const isAdmin = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: "You aren't authorized to use this resource" });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.courierId);

    return res
      .status(200)
      .json(
        deliveryman || 'There are no registered deliveryman with informed id'
      );
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const isAdmin = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: "You aren't authorized to use this resource" });
    }
    const { id, name, email } = await Deliveryman.create(req.body);

    return res.status(200).json({
      message: 'Deliveryman created sucessfully!',
      data: { id, name, email },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const isAdmin = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: "You aren't authorized to use this resource" });
    }

    const deliveryMan = await Deliveryman.findByPk(req.params.courierId);

    if (!deliveryMan) {
      return res.status(400).json({
        error: 'There are no registered deliveryman with informed id',
      });
    }
    await deliveryMan.update(req.body);

    return res.status(200).json({
      message: 'Deliveryman updated sucessfully!',
      courier: deliveryMan,
    });
  }

  async delete(req, res) {
    const isAdmin = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: "You aren't authorized to use this resource" });
    }

    const deliveryMan = await Deliveryman.findByPk(req.params.courierId);

    if (!deliveryMan) {
      return res.status(400).json({
        error: 'There are no registered deliveryman with informed id',
      });
    }

    await deliveryMan.destroy();

    return res.status(200).json({
      message: 'Deliveryman deleted sucessfully!',
    });
  }
}

export default new DeliverymanController();
