export const guardarDatosDePago = async(req, res) => {
    try {
        const data = req.body;

        console.log(data);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}