import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguageContext, languageNames, languageFlags, type Language } from '@/hooks/use-language';

export function LanguageSelector() {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguageContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languageFlags[currentLanguage]} {languageNames[currentLanguage]}
          </span>
          <span className="sm:hidden">
            {languageFlags[currentLanguage]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language}
            onClick={() => changeLanguage(language)}
            className={`flex items-center gap-3 ${
              currentLanguage === language ? 'bg-green-50 dark:bg-green-900/20' : ''
            }`}
          >
            <span className="text-lg">{languageFlags[language]}</span>
            <span>{languageNames[language]}</span>
            {currentLanguage === language && (
              <span className="ml-auto text-green-600 dark:text-green-400">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CompactLanguageSelector() {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguageContext();

  return (
    <Select value={currentLanguage} onValueChange={(value: Language) => changeLanguage(value)}>
      <SelectTrigger className="w-fit min-w-[120px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{languageFlags[currentLanguage]}</span>
            <span className="text-sm">{languageNames[currentLanguage]}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((language) => (
          <SelectItem key={language} value={language}>
            <div className="flex items-center gap-2">
              <span>{languageFlags[language]}</span>
              <span>{languageNames[language]}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}