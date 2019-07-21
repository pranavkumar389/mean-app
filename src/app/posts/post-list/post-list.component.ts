import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postSubs: Subscription;
  private authStatusSubs: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  isUserAuthenticated = false;
  userId: string;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getuserId();
    this.postSubs = this.postService.getPostUpdateListener()
      .subscribe((posts: { posts: Post[], count: number }) => {
        this.posts = posts.posts;
        this.totalPosts = posts.count;
        this.isLoading = false;
      });

    this.isUserAuthenticated = this.authService.getAuthenticationStatus();

    this.authStatusSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
      this.userId = this.authService.getuserId();
    });
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    },
    () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    if (this.postSubs) {
      this.postSubs.unsubscribe();
    }
    if (this.authStatusSubs) {
      this.authStatusSubs.unsubscribe();
    }
  }

}
