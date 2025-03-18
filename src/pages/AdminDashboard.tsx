
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, Edit, Trash2, Download, FileJson, FileSpreadsheet, 
  List, Search, FolderPlus, FolderEdit, Upload
} from 'lucide-react';
import FileUploader from '@/components/admin/FileUploader';
import CategoryForm from '@/components/admin/CategoryForm';
import QuestionForm from '@/components/admin/QuestionForm';
import { Question, Category } from '@/types/quiz';
import { 
  getQuestions, getCategories, deleteQuestion, deleteCategory,
  getQuestionsByCategory
} from '@/lib/quizService';
import { downloadJSON, downloadCSV } from '@/lib/fileUtils';
import { auth, isUserAdmin } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions');
  
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploadType, setUploadType] = useState<'questions' | 'categories'>('questions');
  
  const navigate = useNavigate();
  
  // Verifique se o usuário está autenticado e é admin
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        toast.error('Você precisa estar logado para acessar esta página.');
        return;
      }
      
      // Verificar se o usuário é admin
      const isAdmin = await isUserAdmin(user.uid);
      if (!isAdmin) {
        navigate('/');
        toast.error('Você não tem permissão para acessar esta página. Apenas administradores podem acessar o dashboard.');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Buscar categorias
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      // Buscar questões
      let questionsData: Question[];
      
      if (selectedCategory) {
        questionsData = await getQuestionsByCategory(selectedCategory);
      } else {
        questionsData = await getQuestions();
      }
      
      setQuestions(questionsData);
      
      // Aplicar filtro de pesquisa, se houver
      if (searchTerm) {
        const filtered = questionsData.filter(
          q => q.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuestions(filtered);
      } else {
        setFilteredQuestions(questionsData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Ocorreu um erro ao carregar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term) {
      const filtered = questions.filter(
        q => q.text.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions);
    }
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsQuestionDialogOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsQuestionDialogOpen(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta questão?')) {
      try {
        await deleteQuestion(id);
        toast.success('Questão excluída com sucesso!');
        fetchData();
      } catch (error) {
        console.error('Erro ao excluir questão:', error);
        toast.error('Ocorreu um erro ao excluir a questão.');
      }
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Todas as questões associadas a ela também serão excluídas.')) {
      try {
        await deleteCategory(id);
        toast.success('Categoria excluída com sucesso!');
        fetchData();
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        toast.error('Ocorreu um erro ao excluir a categoria.');
      }
    }
  };

  const handleOpenUpload = (type: 'questions' | 'categories') => {
    setUploadType(type);
    setIsUploadDialogOpen(true);
  };

  const handleExport = (format: 'json' | 'csv', type: 'questions' | 'categories') => {
    try {
      const data = type === 'questions' ? questions : categories;
      const fileName = `${type}-${new Date().toISOString().split('T')[0]}.${format}`;
      
      if (format === 'json') {
        downloadJSON(data, fileName);
      } else {
        downloadCSV(data, fileName);
      }
      
      toast.success(`Dados exportados com sucesso no formato ${format.toUpperCase()}.`);
    } catch (error) {
      console.error(`Erro ao exportar dados como ${format}:`, error);
      toast.error(`Ocorreu um erro ao exportar os dados como ${format}.`);
    }
  };

  const renderQuestionsTab = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <p className="text-french-gray">Carregando questões...</p>
        </div>
      );
    }

    if (filteredQuestions.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-french-gray">
            {searchTerm 
              ? 'Nenhuma questão encontrada com o termo pesquisado.' 
              : selectedCategory
                ? 'Nenhuma questão para esta categoria.'
                : 'Nenhuma questão cadastrada.'
            }
          </p>
          <button
            onClick={handleAddQuestion}
            className="mt-4 bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Adicionar Questão
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Questão
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nível
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opções
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.map((question) => {
              const category = categories.find(c => c.id === question.category);
              
              return (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{question.text.length > 50 ? `${question.text.substring(0, 50)}...` : question.text}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category?.name || 'Sem categoria'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      question.difficulty === 'basico' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty === 'basico' ? 'Básico' :
                       question.difficulty === 'medio' ? 'Médio' : 'Expert'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{question.options.length} opções</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCategoriesTab = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <p className="text-french-gray">Carregando categorias...</p>
        </div>
      );
    }

    if (categories.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-french-gray">Nenhuma categoria cadastrada.</p>
          <button
            onClick={handleAddCategory}
            className="mt-4 bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md flex items-center mx-auto"
          >
            <FolderPlus size={16} className="mr-2" />
            Adicionar Categoria
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="glass-card hover-card-effect rounded-xl p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-french-dark">{category.name}</h3>
              <span className={`level-tag ${category.levelClass}`}>
                {category.level === 'basico' ? 'Básico' :
                 category.level === 'medio' ? 'Médio' : 'Expert'}
              </span>
            </div>
            
            <p className="text-french-gray mb-4">{category.description}</p>
            
            <div className="text-sm text-french-gray mb-4">
              {category.questionsCount} {category.questionsCount === 1 ? 'questão' : 'questões'}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleCategoryFilter(category.id)}
                className="text-french-blue hover:text-french-lightBlue font-medium flex items-center"
              >
                <List size={16} className="mr-1" />
                Ver Questões
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Editar"
                >
                  <FolderEdit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-french-lightGray">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-french-dark">Dashboard de Administração</h1>
          <p className="text-french-gray mt-2">Gerencie questões, categorias e configure os quizzes.</p>
        </div>
        
        <Tabs defaultValue="questions" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
            <TabsList className="h-10">
              <TabsTrigger value="questions" className="px-4">Questões</TabsTrigger>
              <TabsTrigger value="categories" className="px-4">Categorias</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {activeTab === 'questions' && (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-french-gray" size={16} />
                    <input
                      type="text"
                      placeholder="Pesquisar questões..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => handleCategoryFilter(e.target.value || null)}
                    className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent"
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={() => activeTab === 'questions' ? handleAddQuestion() : handleAddCategory()}
                  className="bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  {activeTab === 'questions' ? 'Nova Questão' : 'Nova Categoria'}
                </button>
                
                <button
                  onClick={() => handleOpenUpload(activeTab === 'questions' ? 'questions' : 'categories')}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Importar
                </button>
                
                <div className="dropdown relative inline-block">
                  <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                    <Download size={16} className="mr-2" />
                    Exportar
                  </button>
                  <div className="dropdown-content hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                    <button
                      onClick={() => handleExport('json', activeTab === 'questions' ? 'questions' : 'categories')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FileJson size={16} className="mr-2" />
                      Exportar como JSON
                    </button>
                    <button
                      onClick={() => handleExport('csv', activeTab === 'questions' ? 'questions' : 'categories')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FileSpreadsheet size={16} className="mr-2" />
                      Exportar como CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <TabsContent value="questions" className="mt-6">
            {renderQuestionsTab()}
          </TabsContent>
          
          <TabsContent value="categories" className="mt-6">
            {renderCategoriesTab()}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog para adicionar/editar questão */}
      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Editar Questão' : 'Nova Questão'}</DialogTitle>
          </DialogHeader>
          <QuestionForm
            question={editingQuestion || undefined}
            onSuccess={() => {
              setIsQuestionDialogOpen(false);
              fetchData();
            }}
            onCancel={() => setIsQuestionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog para adicionar/editar categoria */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory || undefined}
            onSuccess={() => {
              setIsCategoryDialogOpen(false);
              fetchData();
            }}
            onCancel={() => setIsCategoryDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog para upload de arquivo */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {uploadType === 'questions' ? 'Importar Questões' : 'Importar Categorias'}
            </DialogTitle>
          </DialogHeader>
          <FileUploader
            type={uploadType}
            onUploadSuccess={() => {
              setIsUploadDialogOpen(false);
              fetchData();
            }}
          />
        </DialogContent>
      </Dialog>
      
      <style jsx>{`
        .dropdown:hover .dropdown-content {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
