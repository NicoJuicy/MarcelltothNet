import * as React from 'react';
import { ArticleData } from '../../store/common/article';
import { actionCreators as ArticleActions } from '../../store/actions/article';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/reducers';
import { Table } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { AsyncAction, MakeDispatchProps } from '../../store/common';


interface StateProps{
    articles: ArticleData[];
    isLoading: boolean;
}

type DispatchProps = MakeDispatchProps<typeof ArticleActions>;

type ArticleListPageImplProps = StateProps & DispatchProps;

class ArticleListPageImpl extends React.Component<ArticleListPageImplProps>{

    componentDidMount(){
        this.props.loadArticles();
    }

    render(){
        const {isLoading, articles} = this.props;
        if(isLoading){
            return "Loading...";
        }

        return (
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                    {articles.map(a => (<tr>
                        <td>{a.id}</td>
                        <td>{a.title}</td>
                        <td>{a.publishDate}</td>
                        <td>{a.isPublished ? "+" : "-"}</td>
                        <td>
                            <Link to={`/articles/${a.id}`}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </Link></td>
                    </tr>))}
                </thead>
            </Table>
        );
    }
}

const mapStateToProps = (state: ApplicationState) : StateProps => {
    const {article: {isRefreshing, articleList}} = state;
    return {
        articles: articleList,
        isLoading: isRefreshing
    };
}

export const ArticleListPage = connect<StateProps, DispatchProps, {}, ApplicationState>(
    mapStateToProps,
    {...ArticleActions}
)(ArticleListPageImpl);