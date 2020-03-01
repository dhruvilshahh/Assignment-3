class ProductFilter extends React.Component {
  render() {
    return (
      <div>Showing all available products.</div>
    );
  }
}
class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      name: form.name.value, price: form.price.value.replace('$',''), image: form.image.value, category: form.category.value,
    }
    this.props.createIssue(issue);
    form.name.value = ""; form.price.value = "$";form.image.value = ""; form.category.text = "";
  }
  render() {
    return (
      <form method="POST" name="issueAdd" onSubmit={this.handleSubmit}>
      <div id="section-1">
        <p> Product Name <br></br>
        <input type="text" name="name" placeholder="name" />
        </p>
        <p>Price Per Unit <br></br>
        <input type="text" name="price" placeholder="price" defaultValue="$" />
        </p>
        <button>Add Product </button>
        </div>
        <div id="section-2">
        <p> Category <br></br>
        <select name="category">
          <option value="Shirts" >Shirts</option>
          <option value="Jeans">Jeans</option>
          <option value="Jackets">Jackets</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Accessories">Accessories</option>
        </select>
        </p>
        <p> Image URL <br></br>
        <input type="text" name="image" />
        </p>
        </div>
      </form>
    );
  }
}
class ProductRow extends React.Component {
  render() {
    const issue = this.props.issue;
    return (
      <tr>
        <td>{issue.name}</td>
        <td>${issue.price}</td>
        <td>{issue.category}</td>
        <td><a href = {issue.image} target="_blank">View</a></td>
      </tr>
    );
  }
}
class ProductTable extends React.Component {
  render() {
    const issueRows = this.props.issues.map(issue =>
      <ProductRow key={issue.id} issue={issue} />
    );
    return (
      <div>
      <table className="bordered-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {issueRows}
        </tbody>
      </table>
      <br></br>
      <div> Add a new product to inventory. < /div>
      </div>
    );
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    const query = `query {
      ProductList {
        name price category image
      }
    }`;
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query })
      });
      const body = await response.text();
      const result = JSON.parse(body);
      this.setState({ issues: result.data.ProductList });
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: productInputs!) {
      productAdd(issue: $issue) {
        id
      }
    }`;
    const response = await fetch('/graphql', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json'},
       body: JSON.stringify({ query, variables: { issue } })
     });
     this.loadData();
  }
  render() {
    return (
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <ProductFilter />
        <hr />
        <ProductTable issues={this.state.issues} />
        <hr />
        <ProductAdd createIssue={this.createIssue} />
      </React.Fragment>
    );
  }
}
const element = <ProductList />;
ReactDOM.render(element, document.getElementById('contents'));
