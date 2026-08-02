import { describe, it, expect } from "vitest";
import { getDictionary, translate, DEFAULT_LANGUAGE } from "../index";
import enDict from "../../../../messages/en.json";
import ptBrDict from "../../../../messages/pt-BR.json";

describe("i18n system", () => {
  it("resolves DEFAULT_LANGUAGE from env or defaults to English ('en')", () => {
    expect(["en", "pt-BR"]).toContain(DEFAULT_LANGUAGE);
    const dict = getDictionary();
    expect(dict.Nav.dashboard).toBeDefined();
  });

  it("loads Portuguese ('pt-BR') dictionary correctly", () => {
    const dict = getDictionary("pt-BR");
    expect(dict.Nav.dashboard).toBe("Painel");
    expect(dict.Nav.links).toBe("Links");
  });

  it("ensures key parity between English and Portuguese dictionaries", () => {
    function getKeys(obj: any, prefix = ""): string[] {
      return Object.keys(obj).reduce((res: string[], key: string) => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && value !== null) {
          res.push(...getKeys(value, newKey));
        } else {
          res.push(newKey);
        }
        return res;
      }, []);
    }

    const enKeys = getKeys(enDict).sort();
    const ptKeys = getKeys(ptBrDict).sort();

    expect(enKeys).toEqual(ptKeys);
  });

  it("translates input placeholders in both languages", () => {
    const enSearch = translate("en", "Placeholders.searchLinks");
    const ptSearch = translate("pt-BR", "Placeholders.searchLinks");

    expect(enSearch).toBe("Search links...");
    expect(ptSearch).toBe("Buscar links...");

    const enUrl = translate("en", "Placeholders.urlInput");
    const ptUrl = translate("pt-BR", "Placeholders.urlInput");

    expect(enUrl).toBe("https://example.com");
    expect(ptUrl).toBe("https://exemplo.com.br");
  });

  it("falls back to English when language is invalid", () => {
    const dict = getDictionary("fr" as any);
    expect(dict.Nav.dashboard).toBe("Dashboard");
  });

  it("falls back to key path when translation key is missing", () => {
    const val = translate("en", "NonExistent.Key.Path");
    expect(val).toBe("NonExistent.Key.Path");
  });
});
