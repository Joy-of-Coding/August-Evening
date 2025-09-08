import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

type Developer = {
  name: string;
  role?: string;
  link?: string;
  linkType?: "github" | "twitter" | "website";
};

const developers: Developer[] = [
 
  {
    name: "Mindi Briese",
    role: "Project Manager",
    link: "https://github.com/mbriese",
    linkType: "github",
  },

  {
    name: "John Schlautman",
    role: "Tech Lead",
    link: "https://github.com/schlajo",
    linkType: "github",
  },
  
  {
    name: "Timothy Batchelder",
    role: "Project Engineer",
    link: "https://github.com/tbatchelder",
    linkType: "github",
  },
  {
    name: "Dorian Germain Zambo Zambo",
    role: "UI/UX Designer and Developer",
    link: "https://github.com/nariod14",
    linkType: "github",
  },
  {
    name: "Anna Rankin",
    role: "Developer and UI/UX Designer",
    link: "https://github.com/annaR920",
    linkType: "github",
  },

  {
    name: "Michelle Evans",
    role: "UI/UX Designer",
    link: "https://github.com/mevans65",
    linkType: "github",
  },

  {
    name: "Glenn Byers",
    role: "Developer",
    link: "https://github.com/glenn-qm",
    linkType: "github",
  },

  {
    name: "Lisa Dean",
    role: "Developer",
    link: "https://github.com/lrdean",
    linkType: "github",
  },

  {
    name: "Eddy Nelson Rivera",
    role: "Developer",
    link: "https://github.com/enr78",
    linkType: "github",
  },

  {
    name: "Jas Atanasievska",
    role: "Developer",
    link: "https://github.com/bonzita",
    linkType: "github",
  },

  {
    name: "Kai Pannu",
    role: "Developer",
    link: "https://github.com/kai-by-design",
    linkType: "github",
  },

{
  name: "Katrina Wright",
  role: "Producer",
  link: "https://github.com/katrinawright",
  linkType: "github",
},
];

export default function CreditsPage() {
  const getLinkIcon = (linkType?: string) => {
    switch (linkType) {
      case "github":
        return <Github className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getLinkText = (linkType?: string) => {
    switch (linkType) {
      case "github":
        return "GitHub";
      case "twitter":
        return "Twitter";
      default:
        return "Visit";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-slate-700 to-slate-600 text-white p-6">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl tracking-tight mb-4"
            style={{ color: "rgb(0, 188, 212)", fontWeight: 600 }}
          >
            BudgetBuddy
          </h1>
          <p className="text-xl text-slate-300 font-light">
            Future-focused tiny tech for your future self
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="bg-black/40 backdrop-blur-lg border border-slate-600/50 shadow-2xl relative">
          {/* Back Button */}
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
            <Button
              variant="outline"
              size="default"
              className="bg-slate-900/60 border-cyan-500/50 text-indigo-300 hover:bg-gray-100 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex-shrink-0"
              onClick={() => window.history.back()}
            >
              ← Back
            </Button>
          </div>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-semibold text-cyan-300">
              Meet the Team
            </CardTitle>
            <p className="text-slate-400 mt-2">
              The talented individuals behind BudgetBuddy
            </p>
          </CardHeader>
          <Separator className="mx-8 bg-slate-600/50" />
          <CardContent className="p-8">
            <div className="grid gap-6">
              {developers.map((dev, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-400/60 to-blue-600/40 hover:from-purple-700/70 hover:to-blue-600/50 border border-slate-600/40 hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between">
                      {/* Developer Info */}
                      <div className="flex-1 min-w-0 pr-">
                        <h3 className="text-xl font-semibold text-white mb-2 truncate">
                          {dev.name}
                        </h3>
                        {dev.role && (
                          <p className="text-cyan-300 text-base font-medium mb-1">
                            {dev.role}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Active contributor</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {dev.link ? (
                        <Button
                          variant="outline"
                          size="default"
                          asChild
                          className="bg-slate-900/60 border-cyan-500/50 text-cyan-300 hover:bg-gray-100 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex-shrink-0"
                        >
                          <a
                            href={dev.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2"
                          >
                            {getLinkIcon(dev.linkType)}
                            <span className="hidden sm:inline">
                              {getLinkText(dev.linkType)}
                            </span>
                          </a>
                        </Button>
                      ) : (
                        <div className="px-4 py-2 text-slate-100 text-sm italic flex-shrink-0">
                          Coming soon
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Footer Section */}
            <div className="mt-12 pt-8 border-t border-slate-600/30">
              <div className="text-center space-y-4">
                <p className="text-slate-400 text-lg font-medium">
                  Made with ❤️ for your financial future
                </p>
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                  <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                  <span>Open Source</span>
                  <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                  <span>Privacy First</span>
                  <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                  <span>Community Driven</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
