import cloudinary from "cloudinary";
import Eventos from "../models/Eventos.js";

export const crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_inicio, fecha_final, tipo, video } = req.body;
    if (!titulo || !descripcion || !fecha_inicio || !tipo) {
      return res.status(400).json("Todos los datos son requeridos");
    }

    let idImg = null;
    let urlImg = null;


    if (req.files.eventoImg) {
      const fotoEvento = await cloudinary.uploader.upload(
        req.files.eventoImg[0].path
      );
      idImg = fotoEvento.public_id;
      urlImg = fotoEvento.secure_url;
    }

    // Manejo del PDF
    let idPdf = null;
    let urlPdf = null;

    if (req.files.pdf) {
      const pdfEvento = await cloudinary.uploader.upload(
        req.files.pdf[0].path,
        {

          resource_type: 'raw',
          public_id: `evento_pdf_${Date.now()}`,
          folder: 'eventos',
          overwrite: true,
          resource_type: 'auto',

        }
      );
      idPdf = pdfEvento.public_id;
      urlPdf = pdfEvento.secure_url;
    }

    const eventoModel = new Eventos(req.body);
    eventoModel.imagen.idImg = idImg;
    eventoModel.imagen.urlImg = urlImg;
    eventoModel.pdf.idPdf = idPdf;
    eventoModel.pdf.urlPdf = urlPdf;
    await eventoModel.save();

    res.status(200).json("Evento Creado Correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};

export const verEventos = async (req, res) => {
  try {
    const eventos = await Eventos.find();
    if (!eventos) {
      return res.status(400).json(" Error al traer los datos ");
    }

    res.status(200).json(eventos);
  } catch (error) {
    console.log(error);
    return res.status(500).json(" Error en el servidor ");
  }
};


export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Eventos.findById(id);

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (evento.imagen?.idImg) {
      await cloudinary.uploader.destroy(evento.imagen.idImg);
    }

    await Eventos.findByIdAndDelete(id);

    return res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const actualizarEvento = async (req, res) => {
  try {
    const { tipo, titulo, fecha_inicio, descripcion, lugar, video } = req.body;
    const { id } = req.params;

    const updateData = {
      tipo,
      titulo,
      fecha_inicio,
      lugar,
      descripcion,
    };

    if (video) {
      updateData.video = video;
    }

    if (req.files.eventoImg && req.files.pdf) {

      const pdfEvento = await cloudinary.uploader.upload(
        req.files.pdf[0].path,
        {
          resource_type: 'raw',
          public_id: `evento_pdf_${Date.now()}`,
          folder: 'eventos',
          overwrite: true,
          resource_type: 'auto',
        }
      );
      const fotoEvento = await cloudinary.uploader.upload(req.files.eventoImg[0].path);

      updateData['imagen.idImg'] = fotoEvento.public_id;
      updateData['imagen.urlImg'] = fotoEvento.secure_url;
      updateData['pdf.idPdf'] = pdfEvento.public_id;
      updateData['pdf.urlPdf'] = pdfEvento.secure_url;

    } else if (req.files.eventoImg && !req.files.pdf) {

      const fotoEvento = await cloudinary.uploader.upload(req.files.eventoImg[0].path);

      updateData['imagen.idImg'] = fotoEvento.public_id;
      updateData['imagen.urlImg'] = fotoEvento.secure_url;

    } else if (req.files.pdf && !req.files.eventoImg) {

      const pdfEvento = await cloudinary.uploader.upload(
        req.files.pdf[0].path,
        {
          resource_type: 'raw',
          public_id: `evento_pdf_${Date.now()}`,
          folder: 'eventos',
          overwrite: true,
          resource_type: 'auto',
        }
      );

      updateData['pdf.idPdf'] = pdfEvento.public_id;
      updateData['pdf.urlPdf'] = pdfEvento.secure_url;
    }

    await Eventos.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json("Evento Actualizado");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error en el servidor");
  }
}



