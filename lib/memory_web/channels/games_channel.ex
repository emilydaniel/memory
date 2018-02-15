defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  require Logger
  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new_game()
      socket = socket
               |> assign(:game, game)
               |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("click", index, socket) do
    game = Game.click(socket.assigns[:game], index)
    socket = assign(socket, :game, game)
    {:reply, {
      :ok,
      %{ "game" => Game.client_view(game)}}, socket}
  end

  def handle_in("new", socket) do
    game = Game.new_game()
    socket = assign(socket, :game, game)
    {:reply, {
      :ok,
      %{ "game" => Game.client_view(game)}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
