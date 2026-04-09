use relm4::adw;
use relm4::prelude::*;

pub struct WindowTitleNoSubtitle;

#[relm4::component(pub)]
impl SimpleComponent for WindowTitleNoSubtitle {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::WindowTitle {
            set_title: "Title",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
