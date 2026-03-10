export default function handler(req, res) {
  const { method, query, body } = req;

  switch (method) {
    case "GET":
      if (query.id) {
        // GET /api/events/:id
        res.status(200).json({ message: `Fetch event with id ${query.id}` });
      } else {
        // GET /api/events
        res.status(200).json({ message: "Fetch all events" });
      }
      break;

    case "POST":
      // Create event
      res.status(201).json({
        message: "Event created",
        event: { ...body }
      });
      break;

    case "PUT":
      if (!query.id) return res.status(400).json({ message: "Event ID required" });
      res.status(200).json({ message: `Event ${query.id} updated` });
      break;

    case "DELETE":
      if (!query.id) return res.status(400).json({ message: "Event ID required" });
      res.status(200).json({ message: `Event ${query.id} deleted` });
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
