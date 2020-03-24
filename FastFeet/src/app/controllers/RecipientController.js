import * as Yup from 'yup';
import User from '../models/User';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      address_number: Yup.string(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const isAdmin = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: 'You cannot authorized to use this resource.' });
    }

    const userExists = await Recipient.findOne({
      where: {
        name: req.body.name,
        address: req.body.address,
        address_number: req.body.address_number,
        complement: req.body.complement,
        city: req.body.city,
        state: req.body.state,
        postal_code: req.body.cep,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const {
      id,
      name,
      address,
      address_number,
      complement,
      city,
      state,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      message: 'Recipient created successfully!',
      data: {
        id,
        name,
        address,
        address_number,
        complement,
        city,
        state,
        postal_code: cep,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      address: Yup.string(),
      address_number: Yup.string(),
      complement: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      cep: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const isAdmin = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: 'You cannot authorized to use this resource.' });
    }

    const recipient = await Recipient.findByPk(req.params.recipientId);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const {
      name,
      address,
      address_number,
      complement,
      city,
      state,
      cep,
    } = await recipient.update(req.body);

    return res.json({
      message: 'Recipient updated successfully!',
      data: {
        name,
        address,
        address_number,
        complement,
        city,
        state,
        postal_code: cep,
      },
    });
  }
}

export default new RecipientController();
