import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postSubs: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);

    this.postSubs =  this.postService.getPostUpdateListener()
      .subscribe((posts: {posts: Post[], count: number}) => {
        this.posts = posts.posts;
        this.totalPosts = posts.count;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    if (this.postSubs) {
      this.postSubs.unsubscribe();
    }
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe( () => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

}
