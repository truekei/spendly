import NotFoundDark from "@/assets/notfound_dark.svg";
import NotFoundLight from "@/assets/notfound_light.svg";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/lib/utils";
import { ArrowUpLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Theme = "light" | "dark";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const theme = (getCookie("theme") as Theme) || "light";

  return (
    <div
      className={`absolute w-full h-full bg-notfound-background ${
        theme === "dark" && "dark"
      }`}
    >
      <div className="grid lg:grid-cols-2 md:grid-cols-1 space-x-15 items-center content-center lg:text-left md:text-center w-300 lg:absolute md:relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {theme === "light" ? (
          <img
            src={NotFoundLight}
            className="logo lg:h-125 md:h-75 place-self-center"
            alt="404"
          />
        ) : (
          <img
            src={NotFoundDark}
            className="logo lg:h-125 md:h-75 place-self-center"
            alt="404"
          />
        )}
        <div className="flex flex-col text-notfound-foreground">
          <h1 className="uppercase text-8xl font-black">Oops!</h1>
          <h3 className="capitalize text-5xl font-medium">Page Not Found</h3>
          <p className="text-xl font-medium my-5">
            This link is empty. Maybe it was a typo or it’s still in
            development. No worries, you can head back home safely.
          </p>
          <Button
            className="w-fit lg:place-self-start md:place-self-center text-lg text-notfound-background bg-notfound-foreground hover:bg-notfound-foreground/90"
            onClick={() => navigate("/")}
            size={"lg"}
          >
            <ArrowUpLeft />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
