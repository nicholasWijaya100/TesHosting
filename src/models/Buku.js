'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Buku extends Model {
        static associate(models) {
            Buku.belongsTo(models.KategoriBuku, {
                foreignKey: "kategori_id",
                otherKey: "kategori_id",
            });
            Buku.belongsToMany(models.Toko, {
                through: models.TokoBuku,
                foreignKey: "buku_id",
                otherKey: "toko_id",
            });
        }
    }
    Buku.init(
        {
            buku_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            buku_nama: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                get() {
                    const val = this.getDataValue("buku_nama")
                    return val ? val.toUpperCase() : null
                },
                set(value) {
                    this.setDataValue("buku_nama", value.toUpperCase())
                }
            },
            buku_tahun_terbit: {
                type: DataTypes.INTEGER(4),
                validate: {
                    isNumeric: true,
                    max: {
                        args: [3000],
                        msg: "Tidak boleh lebih dari 3000 yaaa"
                    },
                    min: {
                        args: [1900],
                        msg: "Tidak boleh kurang dari 1900 yaaa"
                    },
                }
            },
            kategori_id: {
                type: DataTypes.BIGINT
            },
            keterangan_lengkap: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `Buku ini berjudul ${this.buku_nama} dan terbit pada ${this.buku_tahun_terbit}`
                },
                set() {
                    throw new Error("Tidak boleh membuat field keterangan lengkap")
                }
            }
        },
        {
            sequelize,
            modelName: 'buku',
            tableName: 'buku',
            paranoid: true,
            name: {
                singular: "Buku",
                plural: "Buku"
            }
        }
    );
    return Buku;
};
