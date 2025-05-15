import { Schema, model } from 'mongoose';

const eventosSchema = new Schema(
    {
        titulo: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: true
        },
        imagen: {
            idImg: {
                type: String,
                default: null
            },
            urlImg: {
                type: String,
                default: null
            }
        },
        pdf: {
            idPdf: {
                type: String,
                default: null
            },
            urlPdf: {
                type: String,
                default: null
            }
        },
        video: {
            type: String,
            required: false
        },
        fecha_inicio: {
            type: Date,
            required: true
        },
        fecha_final: {
            type: Date,
            required: false
        },
        tipo: {
            type: String,
            required: true,
            enum: ['destacado', 'noticia', 'cronograma']
        },
        estado: {
            type: Boolean,
            default: true
        },
        lugar: {
            type: String,
            default: null
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model("Eventos", eventosSchema)