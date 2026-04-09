"use client";

// This component exists solely to import the boneyard registry on the client.
// In Next.js App Router, layout.tsx is a Server Component. Importing a
// "use client" module directly from a server component for side-effects does
// NOT guarantee the side-effect (registerBones) runs on the client.
// Rendering this as a JSX element in the layout correctly crosses the
// server→client boundary and ensures the registry is always loaded.
import "../bones/registry";

export default function BonesRegistryLoader() {
    return null;
}
