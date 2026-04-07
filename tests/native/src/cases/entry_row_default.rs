use relm4::adw;
use relm4::adw::prelude::*;
use relm4::prelude::*;

pub struct EntryRowDefault;

#[relm4::component(pub)]
impl SimpleComponent for EntryRowDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::EntryRow {
            set_title: "Title",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
