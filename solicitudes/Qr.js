import qrcode from "qrcode-terminal";
const MostrarQrEnTerminal = (req, res) => {
  let { qr } = req.body;
  qrcode.generate(qr, { small: true });
  res.send({ estatus: "listo" });
};

export default MostrarQrEnTerminal;
