import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>Página no encontrada | Mi Casa Verde</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Página no encontrada</p>
          <p className="mb-4 text-sm text-muted-foreground">
            La ruta <code className="bg-background px-1 py-0.5 rounded">{location.pathname}</code> no existe.
          </p>
          <Link to="/" className="text-primary underline hover:text-primary/90">
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
