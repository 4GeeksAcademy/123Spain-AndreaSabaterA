// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Characters } from "./pages/Characters.jsx";
import { SpaceShips } from "./pages/SpaceShips.jsx";
import { Planets } from "./pages/Planets.jsx";
import { Contacts } from "./pages/Contacts.jsx";
import { CharactersDetails } from "./pages/CharactersDetails.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="characters" element={<Characters />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />
      <Route path="spaceships" element={<SpaceShips />} />
      <Route path="startships" element={<SpaceShips />} />
      <Route path="planets" element={<Planets />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="character-details/:uid" element={<CharactersDetails />} />
    </Route>
  )
);
