import * as React from 'react';
import { RouteComponentProps, Prompt } from 'react-router';
import { ArticleData } from '../../store/common/article';
import { ApplicationState } from '../../store/reducers';
import { connect } from 'react-redux';
import { actionCreators as ArticleActions } from '../../store/actions/article';
import { ArticleEditor } from './article-editor';
import { VoidFunctionOf } from '../../store/common';
import { CardBody, Card, CardTitle, CardSubtitle, Button } from 'reactstrap';


interface MatchParams{
    id: string;
}

interface OwnProps extends RouteComponentProps<MatchParams>{
}

interface StateProps{
    isLoading: boolean;
    article?: ArticleData;
}

type DispatchProps = {
    loadArticle: VoidFunctionOf<typeof ArticleActions.loadSingleArticle>,
    saveArticle: VoidFunctionOf<typeof ArticleActions.saveArticle>,
    archiveArticle: VoidFunctionOf<typeof ArticleActions.archiveArticle>,
    publishArticle: VoidFunctionOf<typeof ArticleActions.publishArticle>,
    changeTitle: typeof ArticleActions.changeTitle,
    changePublishDate: typeof ArticleActions.changePublishDate,
    changeThumbnail: typeof ArticleActions.changeThumbnail,
    changeContent: typeof ArticleActions.changeContent,
};

type ArticleEditPageImplProps = OwnProps & StateProps & DispatchProps;

class ArticleEditPageImpl extends React.Component<ArticleEditPageImplProps>{
    componentDidMount(){
        const {loadArticle,match: {params: {id}}} = this.props;
        
        loadArticle(Number(id));
    }

    private handleChangePublishDate = (newDate: Date) => {
        this.props.changePublishDate(Number(this.props.match.params.id), newDate);
    }

    private handleChangeTitle = (newValue: string) => {
        this.props.changeTitle(Number(this.props.match.params.id), newValue);
    }

    private handleChangeThumbnail = (newUri: string, newAltText: string) => {
        this.props.changeThumbnail(Number(this.props.match.params.id), newUri, newAltText);
    }

    private handleChangeContent = (newValue: string) => {
        this.props.changeContent(Number(this.props.match.params.id), newValue);
    }
    
    private handleSaveClick = () => {
        this.props.saveArticle(Number(this.props.match.params.id));
    }
    
    private handleArchiveClick = () => {
        this.props.archiveArticle(Number(this.props.match.params.id));
    }

    private handlePublishClick = () => {
        this.props.publishArticle(Number(this.props.match.params.id));
    }

    render(){
        const {article, isLoading} = this.props;
        if(isLoading){
            return "Loading";
        }
        if(article === undefined){
            return "Not found";
        }
        return <div className="mt-3">
            <div className="d-flex justify-content-end">
                {article.isPublished 
                    ? <Button outline color="danger" onClick={this.handleArchiveClick}>Archive</Button>
                    : <Button outline color="primary" onClick={this.handlePublishClick}>Publish</Button>
                }
                <Button outline color="success" disabled={!article.isDirty} onClick={this.handleSaveClick}>Save</Button>
            </div>
            <ArticleEditor article={article} 
                        onChangeTitle={this.handleChangeTitle}
                        onChangePublishDate={this.handleChangePublishDate}
                        onChangeThumbnail={this.handleChangeThumbnail}
                        onChangeContent={this.handleChangeContent} />
            <Prompt message="Are you sure you want to discard your edits?" when={!!article.isDirty}/>
        </div>;
    }
}


const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) : StateProps => {
    return {
        isLoading: state.article.isRefreshing,
        article: state.article.articleList.find(a => a.id.toString() === ownProps.match.params.id)
    }
};


export const ArticleEditPage = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
    mapStateToProps,
    {
        loadArticle: ArticleActions.loadSingleArticle,
        changeTitle: ArticleActions.changeTitle, 
        changePublishDate: ArticleActions.changePublishDate,
        changeThumbnail: ArticleActions.changeThumbnail,
        changeContent: ArticleActions.changeContent,
        saveArticle: ArticleActions.saveArticle,
        archiveArticle: ArticleActions.archiveArticle,
        publishArticle: ArticleActions.publishArticle
    }
)(ArticleEditPageImpl);