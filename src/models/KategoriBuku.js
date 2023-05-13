"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class KategoriBuku extends Model {
        static associate(models) {
            KategoriBuku.hasMany(models.Buku, {
                foreignKey: "kategori_id",
                otherKey: "kategori_id",
            });
        }
    }
    KategoriBuku.init(
        {
            kategori_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            kategori_nama: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize, //koneksi
            modelName: "kategori_buku",
            tableName: "kategori_buku",
            paranoid: true, //softdelete
            name: {
                singular: "KategoriBuku",
                plural: "KategoriBuku",
            },
        }
    );
    return KategoriBuku;
};
