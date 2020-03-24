import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        address_number: Sequelize.STRING,
        complement: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        cep: Sequelize.VIRTUAL,
        postal_code: Sequelize.NUMBER,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async recipient => {
      const pattern = new RegExp(/[^\d]/, 'gmi');
      recipient.postal_code = recipient.cep.replace(pattern, '');
    });

    this.addHook('beforeFind', async recipient => {
      if (!recipient.where.postal_code) {
        return;
      }

      const pattern = new RegExp(/[^\d]/, 'gmi');
      recipient.where.postal_code = recipient.where.postal_code.replace(
        pattern,
        ''
      );
    });

    return this;
  }
}

export default Recipient;
