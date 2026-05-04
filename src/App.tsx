import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Instagram, 
  MapPin, 
  MessageCircle, 
  Phone, 
  ShoppingBag, 
  Clock, 
  ChevronRight,
  Plus,
  Trash2,
  Save,
  Settings,
  X,
  Upload,
  Link as LinkIcon,
  Type,
  Palette,
  Lock,
  Mail,
  Globe,
  Facebook
} from "lucide-react";
import { AppConfig, LinkItem } from "./types";

// Mapeamento de ícones para exibição dinâmica
const ICON_MAP: Record<string, React.ReactNode> = {
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  Instagram: <Instagram className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  Link: <LinkIcon className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Facebook: <Facebook className="w-5 h-5" />,
};

const COLORS = [
  "bg-green-600",
  "bg-blue-600",
  "bg-pink-600",
  "bg-purple-600",
  "bg-orange-600",
  "bg-market-yellow text-market-dark",
  "bg-white text-market-dark",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar dados");
        return res.json();
      })
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        // Fallback para caso o servidor demore ou falhe na primeira vez
        setTimeout(() => setLoading(false), 5000); 
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === "admin" && loginForm.password === "124324") {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginError("");
      setLoginForm({ username: "", password: "" });
    } else {
      setLoginError("Usuário ou senha incorretos");
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowLogin(true);
    }
  };

  const saveConfig = async (newConfig: AppConfig) => {
    setSaving(true);
    try {
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });
      setConfig(newConfig);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file && config) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'profile') {
          saveConfig({ ...config, profileImage: base64String });
        } else {
          saveConfig({ ...config, coverImage: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen market-gradient flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }} 
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Settings className="w-10 h-10 text-market-yellow" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen market-gradient flex flex-col items-center selection:bg-market-yellow selection:text-market-dark font-sans text-white relative">
      
      {/* Botão de Admin no rodapé/canto (Cadeado) */}
      <button 
        onClick={handleAdminClick}
        className="fixed bottom-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all shadow-lg active:scale-90"
      >
        {isAdmin ? <X className="w-5 h-5 text-market-dark font-bold" /> : <Lock className="w-5 h-5 text-white/50" />}
      </button>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-market-dark/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xs bg-white rounded-3xl p-8 text-market-dark shadow-2xl relative"
            >
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-market-blue rounded-2xl flex items-center justify-center mb-4 shadow-lg rotate-3">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold">Acesso Restrito</h3>
                <p className="text-xs text-gray-400">Entre para gerenciar links</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Usuário</label>
                  <input 
                    type="text" 
                    autoFocus
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-market-blue transition-all"
                    placeholder="Seu usuário"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Senha</label>
                  <input 
                    type="password" 
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-market-blue transition-all"
                    placeholder="••••••••"
                  />
                </div>
                
                {loginError && (
                  <p className="text-[10px] text-red-500 font-bold text-center bg-red-50 p-2 rounded-lg">{loginError}</p>
                )}

                <button 
                  type="submit"
                  className="w-full p-3 bg-market-blue text-white rounded-xl font-bold shadow-lg hover:bg-market-dark active:scale-95 transition-all"
                >
                  Entrar
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW MODE */}
      <AnimatePresence mode="wait">
        {!isAdmin ? (
          <motion.main 
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center pb-12"
          >
            {/* Capa estilo WhatsApp */}
            <div className="w-full h-40 relative bg-market-blue/30 overflow-hidden">
              {config.coverImage ? (
                <img src={config.coverImage} alt="Capa" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full market-gradient opacity-50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-market-dark/60 to-transparent" />
            </div>

            <div className="w-full max-w-sm flex flex-col items-center px-6 -mt-12 relative z-10">
              {/* Header Section */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center mb-8 text-center w-full"
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full overflow-hidden flex items-center justify-center mb-4 border-4 border-white shadow-2xl">
                    {config.profileImage ? (
                      <img src={config.profileImage} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-market-yellow flex items-center justify-center text-market-dark">
                        <span className="font-display font-bold text-4xl tracking-tighter">VK</span>
                      </div>
                    )}
                  </div>
                </div>
                <h1 className="font-display text-3xl font-bold text-white mb-1 drop-shadow-md">
                  {config.name}
                </h1>
                <p className="text-white/90 text-sm max-w-[280px] font-medium italic drop-shadow-sm">
                  {config.description}
                </p>
              </motion.div>
            </div>

            <div className="w-full max-w-sm px-6 space-y-4">
              {/* Info Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full mb-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4"
              >
                <div className="bg-market-yellow/20 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-market-yellow" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Horário de Funcionamento</p>
                  <p className="text-sm font-medium">{config.hours}</p>
                </div>
              </motion.div>

              {/* Links List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {config.links.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative flex items-center gap-4 p-4 rounded-2xl bg-white text-market-dark shadow-lg transition-shadow hover:shadow-2xl border-b-4 border-black/5 active:border-b-0 overflow-hidden`}
                  >
                    <div className={`p-3 rounded-xl flex shrink-0 shadow-inner ${link.color.includes('text') ? link.color.split(' ')[0] : link.color} text-white`}>
                      {ICON_MAP[link.icon] || <LinkIcon className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-lg leading-tight truncate">{link.title}</h2>
                      {link.subtitle && <p className="text-xs text-market-dark/60 font-medium truncate">{link.subtitle}</p>}
                    </div>

                    <ChevronRight className="w-5 h-5 text-market-dark/30 group-hover:text-market-dark/60 transition-colors" />
                    <div className="absolute inset-0 rounded-2xl bg-market-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </motion.div>

              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 mb-8 text-center"
              >
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                  © {new Date().getFullYear()} {config.name}
                </p>
              </motion.footer>
            </div>
          </motion.main>
        ) : (
          /* ADMIN MODE */
          <motion.aside 
            key="admin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg bg-white min-h-screen text-market-dark overflow-y-auto p-6 pb-24 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold">Painel de Controle</h2>
                <p className="text-sm text-gray-500">Personalize seu Comercial Vem K</p>
              </div>
              <button 
                onClick={() => setIsAdmin(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Identidade */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Type className="w-4 h-4" /> Identidade Visual
                </h3>
                
                <div className="space-y-4">
                  <div className="relative group bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="h-32 w-full bg-gray-200 flex items-center justify-center">
                      {config.coverImage ? (
                        <img src={config.coverImage} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400">Sem Foto de Capa</span>
                      )}
                    </div>
                    <label className="absolute bottom-2 right-2 bg-market-blue p-2 rounded-lg cursor-pointer hover:bg-market-dark transition-colors shadow-lg">
                      <div className="flex items-center gap-2 text-[10px] text-white font-bold uppercase">
                        <Upload className="w-3 h-3" /> Alterar Capa
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                    </label>
                  </div>

                  <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-market-yellow overflow-hidden flex items-center justify-center border-2 border-white shadow-md">
                        {config.profileImage ? (
                          <img src={config.profileImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-2xl text-market-dark">VK</span>
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 bg-market-blue p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                        <Upload className="w-3 h-3 text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" 
                        value={config.name}
                        onChange={(e) => setConfig({...config, name: e.target.value})}
                        placeholder="Nome do Mercado"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-lg font-bold outline-none focus:ring-2 focus:ring-market-blue"
                      />
                      <input 
                        type="text" 
                        value={config.description}
                        onChange={(e) => setConfig({...config, description: e.target.value})}
                        placeholder="Descrição curta"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-market-blue"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <span className="text-xs font-bold text-gray-500">Horário de Atendimento</span>
                  <input 
                    type="text" 
                    value={config.hours}
                    onChange={(e) => setConfig({...config, hours: e.target.value})}
                    placeholder="Ex: Seg a Sáb: 08:00 - 19:00"
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-market-blue font-medium"
                  />
                </div>
              </section>

              {/* Links */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Botões de Link
                  </h3>
                  <button 
                    onClick={() => {
                      const newLink: LinkItem = {
                        id: Date.now().toString(),
                        title: "Novo Link",
                        url: "https://",
                        icon: "Link",
                        color: "bg-blue-600"
                      };
                      setConfig({...config, links: [...config.links, newLink]});
                    }}
                    className="p-2 bg-market-blue text-white rounded-lg hover:bg-market-dark transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" /> Adicionar
                  </button>
                </div>

                <div className="space-y-4">
                  {config.links.map((link, index) => (
                    <div key={link.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 relative group">
                      <button 
                        onClick={() => {
                          const newLinks = config.links.filter(l => l.id !== link.id);
                          setConfig({...config, links: newLinks});
                        }}
                        className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-[auto_1fr] gap-4">
                        {/* Seletor de Cores */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Cor</label>
                          <div className="grid grid-cols-2 gap-1 backdrop-blur-sm p-1">
                            {COLORS.map(c => (
                              <button 
                                key={c}
                                onClick={() => {
                                  const newLinks = [...config.links];
                                  newLinks[index].color = c;
                                  setConfig({...config, links: newLinks});
                                }}
                                className={`w-4 h-4 rounded-full ${c.split(' ')[0]} ${link.color === c ? 'ring-2 ring-market-blue ring-offset-1' : ''}`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <select 
                              value={link.icon}
                              onChange={(e) => {
                                const newLinks = [...config.links];
                                newLinks[index].icon = e.target.value;
                                setConfig({...config, links: newLinks});
                              }}
                              className="p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-market-blue"
                            >
                              {Object.keys(ICON_MAP).map(icon => (
                                <option key={icon} value={icon}>{icon}</option>
                              ))}
                            </select>
                            <input 
                              type="text" 
                              value={link.title}
                              onChange={(e) => {
                                const newLinks = [...config.links];
                                newLinks[index].title = e.target.value;
                                setConfig({...config, links: newLinks});
                              }}
                              placeholder="Título"
                              className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-market-blue"
                            />
                          </div>
                          <input 
                            type="text" 
                            value={link.subtitle}
                            onChange={(e) => {
                              const newLinks = [...config.links];
                              newLinks[index].subtitle = e.target.value;
                              setConfig({...config, links: newLinks});
                            }}
                            placeholder="Subtítulo (opcional)"
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-market-blue text-gray-500"
                          />
                          <input 
                            type="text" 
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...config.links];
                              newLinks[index].url = e.target.value;
                              setConfig({...config, links: newLinks});
                            }}
                            placeholder="URL do Link"
                            className="w-full p-2 bg-gray-100 border-none rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-market-blue text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Botão de Salvar Global */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pointer-events-none">
                <button 
                  onClick={() => saveConfig(config)}
                  disabled={saving}
                  className="w-full p-4 bg-market-blue text-white rounded-2xl shadow-2xl font-bold flex items-center justify-center gap-2 hover:bg-market-dark transition-all disabled:opacity-50 pointer-events-auto active:scale-95"
                >
                  {saving ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Background Decorative Elements (sempre visíveis no fundo azul) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden market-gradient">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-market-blue/30 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[20%] w-[50%] h-[50%] bg-market-yellow/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-market-blue/40 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
