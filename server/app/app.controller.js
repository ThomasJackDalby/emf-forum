app.controller("home.controller", function($scope, $http) {
    $scope.title = "TEST MY TESTES"
    $http.get("/threads")
    .then(function(response) {
        $scope.threads = response.data
    });
});
app.controller("thread.controller", function($scope, $http, $routeParams) {
    if ("id" in $routeParams) {
        var threadUrl = "/threads/"+$routeParams["id"];
        function refreshComments() {
            $http.get(threadUrl)
            .then(function(response) {
                $scope.title = response.data.title
                if ($scope.title === undefined) $scope.title = "Untitled"
                $scope.comments = response.data.comments
            });
        }
        refreshComments();
        $scope.submit = function() {
            if ($scope.comment) {
                $http.post(threadUrl,  { "comment" : $scope.comment });
                $scope.comment = "";
                refreshComments();
            }
        };
    }
});
