import * as Yup from 'yup';
import User from '../models/User';
import Order from '../models/Order';

class OrderController {
  async index(req, res) {
    const isAdmin = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: `You aren't authorized to use this resource.` });
    }

    const orders = await Order.findAll();

    return res
      .status(200)
      .json(orders.length === 0 ? 'There are no orders registered.' : orders);
  }

  async show(req, res) {
    const isAdmin = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: `You aren't authorized to use this resource.` });
    }

    const order = await Order.findByPk(req.params.orderId);

    return res
      .status(200)
      .json(order || 'There are no orders registered with informed id.');
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number()
        .positive()
        .required(),
      delivery_man: Yup.number()
        .positive()
        .required(),
      signature_id: Yup.number()
        .positive()
        .required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid())) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const isAdmin = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: `You aren't authorized to use this resource.` });
    }

    const order = await Order.create(req.body);

    return res
      .status(200)
      .json({ message: 'Order created sucessfully!', order });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().positive(),
      delivery_man: Yup.number().positive(),
      signature_id: Yup.number().positive(),
      product: Yup.string(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid())) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const isAdmin = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: `You aren't authorized to use this resource.` });
    }

    const order = await Order.findByPk(req.params.orderId);
    if (!order) {
      return res
        .status(400)
        .json({ error: 'There are no orders registered with informed id.' });
    }
    await order.update(req.body);

    return res
      .status(200)
      .json({ message: 'Order updated sucessfully!', order });
  }

  async delete(req, res) {
    const isAdmin = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: `You aren't authorized to use this resource.` });
    }

    const order = await Order.findByPk(req.params.orderId);
    if (!order) {
      return res
        .status(400)
        .json({ error: 'There are no orders registered with informed id.' });
    }

    await order.destroy();
    return res
      .status(200)
      .json({ message: 'The order was deleted sucessfully.' });
  }
}

export default new OrderController();
