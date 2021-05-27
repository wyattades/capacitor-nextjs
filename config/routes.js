import createRoutes from "lib/createRoutes";

const routeResolver = createRoutes()
  .index()
  .add("/about", "about")
  .add("/items/:item_id", "items.show")
  .add("/things/:thing_id", "things.[thing_id]")
  .add("/statics/:static_id", "statics.[static_id]");

export default routeResolver;
