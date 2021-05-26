import createRoutes from "lib/createRoutes";

export default createRoutes()
  .index()
  .add("/about", "about")
  .add("/items/:item_id", "items.show");
