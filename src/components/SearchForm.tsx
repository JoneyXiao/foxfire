type SearchFormProps = {
  action?: string;
  query?: string;
  autoFocus?: boolean;
};

export function SearchForm({ action = "/search", query = "", autoFocus }: SearchFormProps) {
  return (
    <form className="finder" action={action} method="get" role="search">
      <label className="visually-hidden" htmlFor="q">
        搜索题目
      </label>
      <input
        className="field"
        id="q"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="题干、标签或编号"
        autoComplete="off"
        autoFocus={autoFocus}
      />
      <button className="btn" type="submit">
        搜索
      </button>
    </form>
  );
}
