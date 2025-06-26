
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Agenda.AI</span>
            </Link>
            <p className="text-gray-400">
              A plataforma completa para gestão de agendamentos em salões, barbearias e clínicas.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Produto</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/recursos" className="text-gray-400 hover:text-white transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link to="/precos" className="text-gray-400 hover:text-white transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-gray-400 hover:text-white transition-colors">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ajuda" className="text-gray-400 hover:text-white transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/status" className="text-gray-400 hover:text-white transition-colors">
                  Status do Sistema
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contato@agenda.ai</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Agenda.AI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
